import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Skeleton from './Skeleton';

const docs = getComponentDocs('Core/Skeleton');
// Comment rows under the article: each second line has its own width so the list reads as text.
const comments = ['w-5/6', 'w-2/3', 'w-3/4'];
const placeholders = (canvasElement) => [...canvasElement.querySelectorAll('[aria-hidden="true"]')];
const expectDecorative = async (elements) => {
  for (const element of elements) {
    await expect(element).not.toHaveAccessibleName();
    await expect(getComputedStyle(element).animationName).not.toBe('none');
  }
};

export default {
  title: 'Core/Skeleton',
  id: 'core-skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { className: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { className: 'aspect-video w-full rounded-xl' },
  parameters: {
    docs: {
      description: { story: 'An article page while it loads: a cover, headline, and body lines beside a comment list with avatars. `className` shapes the cover, so try `size-24 rounded-full` or `h-40 w-2/3`.' },
      source: playgroundSource('Skeleton', {
        imports: "import { Skeleton } from '@gaudi/design-system';",
        before: "<section aria-label='Latest article' aria-busy='true' className='grid gap-3'>\n  <span role='status' className='sr-only'>Loading the latest article</span>\n  ",
        after: "\n  <Skeleton className='h-5 w-4/5' />\n  <Skeleton className='h-4 w-full' />\n  <Skeleton className='h-4 w-2/3' />\n</section>"
      })
    }
  },
  render: (args) => (
    <section aria-label='Latest article' aria-busy='true' className='grid gap-5 sm:grid-cols-[3fr_2fr]'>
      <span role='status' className='sr-only'>Loading the latest article</span>
      <div className='grid content-start gap-3'>
        <Skeleton {...args} />
        <Skeleton className='h-5 w-4/5' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>
      <ul className='m-0 grid list-none content-start gap-4 p-0'>
        {comments.map((width) => (
          <li key={width} className='flex items-center gap-3'>
            <Skeleton className='size-9 shrink-0 rounded-full' />
            <span className='grid flex-1 gap-1.5'>
              <Skeleton className='h-3.5 w-1/2' />
              <Skeleton className={`h-3 ${width}`} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  ),
  play: async ({ args, canvasElement }) => {
    const [cover, ...rest] = placeholders(canvasElement);
    await expect(cover).toHaveClass(...args.className.split(/\s+/).filter(Boolean));
    await expectDecorative([cover, ...rest]);
    await expect(rest).toHaveLength(3 + comments.length * 3);
    await expect(cover.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(cover.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading the latest article');
  }
};

export const LoadingRegion = {
  parameters: { docs: { description: { story: 'Skeletons are hidden from assistive technology, so wrap them in a labelled busy region with screen-reader text that names what is loading.' } } },
  render: () => (
    <section aria-label='Latest articles' aria-busy='true' className='grid gap-3'>
      <span role='status' className='sr-only'>Loading latest articles</span>
      <Skeleton className='h-5 w-2/3' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-5/6' />
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lines = placeholders(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Latest articles' })).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading latest articles');
    await expect(lines).toHaveLength(3);
    await expectDecorative(lines);
    await expect(lines[0].getBoundingClientRect().height).toBeGreaterThan(lines[1].getBoundingClientRect().height);
    await expect(lines[1].getBoundingClientRect().width).toBeGreaterThan(lines[2].getBoundingClientRect().width);
  }
};

import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Skeleton from '../Skeleton';
import { Shimmer } from '../Shimmer.jsx';

const docs = getComponentDocs('Core/Skeleton');
// Comment rows under the article: each second line has its own width so the list reads as text.
const comments = ['w-5/6', 'w-2/3', 'w-3/4'];
const placeholders = (canvasElement) => [...canvasElement.querySelectorAll('[aria-hidden="true"]')];
const borderColor = (element) => {
  const probe = element.ownerDocument.createElement('span');
  probe.style.backgroundColor = 'var(--ds-color-border)';
  element.parentElement.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
};
const expectDecorative = async (elements) => {
  for (const element of elements) {
    await expect(element).not.toHaveAccessibleName();
    await expect(getComputedStyle(element).animationName).not.toBe('none');
    // Blocks use the theme border token so they read on light and dark surfaces.
    await expect(getComputedStyle(element).backgroundColor).toBe(borderColor(element));
  }
};

export default {
  title: 'Core/Feedback & States/Skeleton',
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
      description: { story: 'An article page while it loads: a cover, headline, and body lines beside a comment list with avatars. Skeletons are hidden from assistive technology, so the page is a labelled busy region with screen-reader text that names what is loading. `className` shapes the cover, so try `size-24 rounded-control` or `h-40 w-2/3`.' },
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
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Latest article' })).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading the latest article');
  }
};

export const TextShimmer = {
  name: 'Text shimmer',
  parameters: {
    docs: {
      description: { story: 'Shimmer is the text counterpart of Skeleton: a highlight sweeps across a label while work is in progress, on the text tokens so it reads in light and dark. The words stay real text, so they are announced (put them in a `role="status"` region), selectable and translated. `duration` sets one sweep in seconds and `spread` the band width per character; `active={false}` rests it. Readers who reduce motion, and forced-colour modes, see plain text.' },
      source: {
        language: 'jsx',
        code: `import { Shimmer } from '@gaudi/design-system';

<>
<p role='status'><Shimmer>Searching the web…</Shimmer></p>
<Shimmer as='h3' duration={3} spread={3}>Drafting the summary</Shimmer>
<Shimmer active={false}>Thought for 4s</Shimmer>
</>`
      }
    }
  },
  render: () => (
    <div className='grid gap-3 text-sm'>
      <p role='status' className='m-0'><Shimmer>Searching the web…</Shimmer></p>
      <Shimmer as='h3' duration={3} spread={3} className='m-0 text-lg font-semibold'>Drafting the summary</Shimmer>
      <p className='text-text-muted m-0'><Shimmer active={false}>Thought for 4s</Shimmer></p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Searching the web…');
    const active = canvas.getByText('Searching the web…');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await expect(getComputedStyle(active).animationName).toBe(reduced ? 'none' : 'ds-shimmer');
    await expect(getComputedStyle(canvas.getByText('Thought for 4s')).animationName).toBe('none');
  }
};

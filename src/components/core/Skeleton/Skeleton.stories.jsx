import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Skeleton from './Skeleton';

const docs = getComponentDocs('Core/Skeleton');
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
  args: { className: 'h-4 w-40' },
  parameters: {
    docs: {
      source: playgroundSource('Skeleton', { imports: "import { Skeleton } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <Skeleton {...args} />,
  play: async ({ canvasElement }) => {
    const [placeholder] = placeholders(canvasElement);
    await expectDecorative([placeholder]);
    await expect(placeholder.getBoundingClientRect().width).toBeGreaterThan(0);
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

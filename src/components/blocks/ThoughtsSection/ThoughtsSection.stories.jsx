import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ThoughtsSection from './ThoughtsSection';

const docs = getComponentDocs('Blocks/Thoughts');
const thoughts = [
  {
    featured: true,
    slug: 'explicit-contracts',
    summary: 'Small interfaces stay easier to change when their public contract is tested.',
    title: 'Explicit contracts make components durable'
  },
  {
    featured: false,
    slug: 'docs-are-product',
    summary: 'A component story should show the states that teams actually ship.',
    title: 'Docs are part of the product surface'
  },
  {
    featured: true,
    slug: 'interfaces-over-folders',
    summary: 'A useful test follows the rendered UI instead of stopping at the filesystem.',
    title: 'Interfaces matter more than folders'
  }
];
const thoughtLink = (canvas, thought) => canvas.getByRole('link', { name: new RegExp(thought.title) });
const viewAll = (canvas) => canvas.queryByRole('link', { name: 'View all thoughts' });

export default {
  title: 'Blocks/Thoughts',
  component: ThoughtsSection,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { thoughts: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { thoughts },
  parameters: {
    docs: { source: playgroundSource('ThoughtsSection', { imports: "import { ThoughtsSection } from '@gaudi/design-system';" }) }
  },
  render: (args) => <ThoughtsSection {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Recent Thoughts' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('article')).toHaveLength(thoughts.length);
    await expect(canvas.getAllByText('Featured')).toHaveLength(thoughts.filter((thought) => thought.featured).length);
    for (const thought of thoughts) {
      await userEvent.tab();
      await expect(thoughtLink(canvas, thought)).toHaveFocus();
      await expect(thoughtLink(canvas, thought)).toHaveAttribute('href', `/thoughts/${thought.slug}`);
    }
    await userEvent.tab();
    await expect(viewAll(canvas)).toHaveFocus();
    await expect(viewAll(canvas)).toHaveAttribute('href', '/thoughts');
  }
};

export const SingleThought = {
  args: { thoughts: [{ featured: false, slug: 'one-clear-note', title: 'One clear note can still link to the archive' }] },
  parameters: { docs: { description: { story: 'A single note without a summary still sits beside the archive link.' } } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('article')).toHaveLength(1);
    await expect(thoughtLink(canvas, args.thoughts[0])).toHaveAttribute('href', '/thoughts/one-clear-note');
    await expect(canvas.queryByText('Featured')).toBeNull();
    await expect(viewAll(canvas)).toHaveAttribute('href', '/thoughts');
  }
};

export const Empty = {
  args: { thoughts: [] },
  parameters: { docs: { description: { story: 'With no thoughts the heading remains and the archive link is hidden.' } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Recent Thoughts' })).toBeInTheDocument();
    await expect(canvas.queryAllByRole('article')).toHaveLength(0);
    await expect(viewAll(canvas)).toBeNull();
  }
};

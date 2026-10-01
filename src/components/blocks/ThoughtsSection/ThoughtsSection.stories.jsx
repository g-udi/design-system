import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ThoughtsSection from './ThoughtsSection';

const docs = getComponentDocs('Blocks/Thoughts');
// A realistic mix: featured and regular notes, one without a summary, and the last beside the archive link.
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
    featured: false,
    slug: 'naming-is-design',
    title: 'Naming a prop is a design decision'
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
  title: 'Blocks/To Sort/Thoughts', id: 'blocks-thoughts',
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
    docs: {
      description: { story: 'Four notes mixing featured and regular entries, with and without summaries. Edit `thoughts` to change the list: `featured` adds the badge, the last note sits beside the archive link, and an empty array keeps the heading but hides the archive link.' },
      source: playgroundSource('ThoughtsSection', { imports: "import { ThoughtsSection } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <ThoughtsSection {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Recent Thoughts' })).toBeInTheDocument();
    await expect(canvas.queryAllByRole('article')).toHaveLength(args.thoughts.length);
    await expect(canvas.queryAllByText('Featured')).toHaveLength(args.thoughts.filter((thought) => thought.featured).length);
    for (const thought of args.thoughts) {
      await userEvent.tab();
      await expect(thoughtLink(canvas, thought)).toHaveFocus();
      await expect(thoughtLink(canvas, thought)).toHaveAttribute('href', `/thoughts/${thought.slug}`);
    }
    if (!args.thoughts.length) return;
    await userEvent.tab();
    await expect(viewAll(canvas)).toHaveFocus();
    await expect(viewAll(canvas)).toHaveAttribute('href', '/thoughts');
  }
};

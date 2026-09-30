import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PostNavigation from './index';

const docs = getComponentDocs('Post/PostNavigation');
const prev = { slug: 'local-first-software', title: 'Notes on local-first software' };
const next = { slug: 'resilient-components', title: 'A field guide to resilient components that survive real data' };
const labels = { Post: 'Article', Thought: 'Thought' };
const baseUrls = { Post: '/blog', Thought: '/thoughts' };

export default {
  title: 'Post/PostNavigation',
  component: PostNavigation,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['Post', 'Thought'], prev: 'object', next: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'Post', prev, next },
  parameters: {
    docs: {
      description: { story: 'Both neighbours with realistic titles, one long enough to wrap. `type` switches the labels and routes between articles and thoughts; clear `prev` or `next` (set it to `null`) to drop that side without leaving an empty link.' },
      source: playgroundSource('PostNavigation', { imports: "import { PostNavigation } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <PostNavigation {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const label = labels[args.type];
    await expect(canvas.getByRole('navigation', { name: `${label} navigation` })).toBeVisible();
    for (const [side, entry] of [['Previous', args.prev], ['Next', args.next]]) {
      if (!entry) {
        await expect(canvas.queryByRole('heading', { name: `${side} ${label}` })).not.toBeInTheDocument();
        continue;
      }
      await expect(canvas.getByRole('heading', { level: 2, name: `${side} ${label}` })).toBeVisible();
      await expect(canvas.getByRole('link', { name: `${side} ${label} ${entry.title}` })).toHaveAttribute('href', `${baseUrls[args.type]}/${entry.slug}`);
    }
    if (args.next) await expect(canvas.getByRole('link', { name: new RegExp(`^Next ${label}`, 'u') })).toHaveClass('text-right');
  }
};

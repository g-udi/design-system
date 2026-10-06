import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import PostNavigation from '../index';

const docs = getComponentDocs('Post/PostNavigation');
const prev = { id: 'local-first-software', href: '/articles/local-first-software', title: 'Notes on local-first software' };
const next = { id: 'resilient-components', href: '/articles/resilient-components', title: 'A field guide to resilient components that survive real data' };
const labels = { Post: 'Article', Thought: 'Thought' };

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
      description: { story: 'Both neighbours with realistic titles, one long enough to wrap. `type` switches the labels between articles and thoughts; destinations come from each entry’s `href`; clear `prev` or `next` (set it to `null`) to drop that side without leaving an empty link.' },
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
      await expect(canvas.getByRole('link', { name: `${side} ${label} ${entry.title}` })).toHaveAttribute('href', entry.href);
    }
    if (args.next) await expect(canvas.getByRole('link', { name: new RegExp(`^Next ${label}`, 'u') })).toHaveClass('text-right');
  }
};

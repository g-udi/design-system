import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PostNavigation from './index';

const docs = getComponentDocs('Post/PostNavigation');
const prev = { slug: 'previous-post', title: 'Previous post title' };
const next = { slug: 'next-post', title: 'Next post title' };
const previousThought = { slug: 'previous-thought', title: 'Previous thought title' };

export default {
  title: 'Post/PostNavigation',
  component: PostNavigation,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['Post', 'Thought'], headingLevel: [2, 3, 4] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { prev, next, type: 'Post', headingLevel: 2 },
  parameters: {
    docs: { source: playgroundSource('PostNavigation', { imports: "import { PostNavigation } from '@gaudi/design-system';" }) }
  },
  render: (args) => <PostNavigation {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previousLink = canvas.getByRole('link', { name: `Previous Article ${prev.title}` });
    const nextLink = canvas.getByRole('link', { name: `Next Article ${next.title}` });
    await expect(canvas.getByRole('navigation', { name: 'Article navigation' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Previous Article' })).toBeVisible();
    await expect(previousLink).toHaveAttribute('href', `/blog/${prev.slug}`);
    await expect(nextLink).toHaveAttribute('href', `/blog/${next.slug}`);
    await expect(nextLink).toHaveClass('text-right');
  }
};

export const ThoughtNavigation = {
  name: 'Thought with one neighbour',
  parameters: { docs: { description: { story: "`type='Thought'` switches labels and routes to /thoughts, and a missing `next` renders no empty link." } } },
  render: () => <PostNavigation prev={previousThought} next={null} type='Thought' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: `Previous Thought ${previousThought.title}` })).toHaveAttribute('href', `/thoughts/${previousThought.slug}`);
    await expect(canvas.queryByRole('heading', { name: 'Next Thought' })).not.toBeInTheDocument();
  }
};

import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Post from './index';

const docs = getComponentDocs('Post/Post');
const frontMatter = {
  category: 'engineering',
  date: '2026-05-20',
  slug: 'design-systems',
  subtitle: 'How component ownership keeps a blog interface consistent.',
  title: 'Design systems keep editorial rhythm predictable',
  type: 'Post'
};
const draftThought = {
  category: 'process',
  date: '2026-06-01',
  draft: true,
  slug: 'component-contracts',
  subtitle: 'Contract tests should protect behavior consumers can observe.',
  title: 'A short thought about contracts',
  type: 'Thought'
};
const titleLink = (canvas, entry) => canvas.getByRole('link', { name: entry.title });
const categoryLink = (canvas, entry) => canvas.getByRole('link', { name: entry.category });

export default {
  title: 'Post/Post',
  component: Post,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { frontMatter: 'object', locale: 'text', titleAs: ['h2', 'h3', 'h4'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><ul><Story /></ul></ExampleFrame>]
};

export const Playground = {
  args: { frontMatter, titleAs: 'h3' },
  parameters: {
    docs: {
      source: playgroundSource('Post', {
        imports: "import { Post } from '@gaudi/design-system';",
        before: '<ul>\n',
        after: '\n</ul>'
      })
    }
  },
  render: (args) => <Post {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(titleLink(canvas, frontMatter)).toHaveAttribute('href', `/blog/${frontMatter.slug}`);
    await expect(categoryLink(canvas, frontMatter)).toHaveAttribute('href', `/blog/categories/${frontMatter.category}`);
    await expect(canvas.getByRole('article').querySelector('time')).toHaveAttribute('dateTime', frontMatter.date);
    await expect(canvas.getByText(frontMatter.subtitle)).toBeVisible();
    await expect(canvas.queryByText('Draft')).not.toBeInTheDocument();
  }
};

export const DraftThought = {
  parameters: { docs: { description: { story: "`type: 'Thought'` links under /thoughts, and `draft` adds the Draft badge to the metadata row." } } },
  render: () => <Post frontMatter={draftThought} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(titleLink(canvas, draftThought)).toHaveAttribute('href', `/thoughts/${draftThought.slug}`);
    await expect(canvas.getByText('Draft')).toBeVisible();
    await expect(categoryLink(canvas, draftThought)).toHaveAttribute('href', `/blog/categories/${draftThought.category}`);
  }
};

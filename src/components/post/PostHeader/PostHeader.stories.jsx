import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PostHeader from './index';

const docs = getComponentDocs('Post/PostHeader');
const article = {
  category: 'engineering',
  date: '2026-05-20',
  readingTime: { text: '8 min read' },
  slug: 'design-systems',
  subtitle: 'How component ownership keeps a blog interface consistent.',
  title: 'Design systems keep editorial rhythm predictable'
};
const frontMatter = {
  ...article,
  tags: ['design systems', 'react', 'storybook'],
  seriesPosts: [
    { order: 1, series: 'Design Systems', slug: 'foundations', title: 'Foundations' },
    { order: 2, series: 'Design Systems', slug: 'components', title: 'Components' },
    { order: 3, series: 'Design Systems', slug: 'documentation', title: 'Documentation' }
  ]
};
const siteMetadata = { locale: 'en-GB' };

export default {
  title: 'Post/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { frontMatter: 'object', siteMetadata: 'object', titleLevel: [1, 2, 3] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { frontMatter, siteMetadata, titleLevel: 1 },
  parameters: {
    docs: { source: playgroundSource('PostHeader', { imports: "import { PostHeader } from '@gaudi/design-system';" }) }
  },
  render: (args) => <PostHeader {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: args.titleLevel, name: article.title })).toBeVisible();
    await expect(canvas.getByText(article.subtitle)).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Engineering' })).toHaveAttribute('href', '/blog/categories/engineering');
    await expect(canvas.getByText('20 May 2026')).toBeVisible();
    await expect(canvas.queryByText(article.readingTime.text)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'design systems' })).toHaveAttribute('href', '/blog/tags/design-systems');
    await expect(await canvas.findByRole('link', { name: /^storybook$/i })).toHaveAttribute('href', '/blog/tags/storybook');
    await expect(canvas.getByRole('button', { name: /Design Systems/u })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('progressbar', { name: 'Series progress' })).toHaveAttribute('aria-valuenow', '0');
  }
};

export const WithContentsControl = {
  parameters: { docs: { description: { story: '`tocControl` adds a contents action to the timestamp row, placed before the reading time.' } } },
  render: () => (
    <PostHeader
      frontMatter={article}
      siteMetadata={siteMetadata}
      tocControl={<button type='button'>Show contents</button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const contentsControl = canvas.getByRole('button', { name: 'Show contents' });
    const readingTime = canvas.getByText(article.readingTime.text);
    await expect(contentsControl).toBeVisible();
    await expect(readingTime).toBeVisible();
    await expect(contentsControl.parentElement.contains(readingTime)).toBe(true);
    await expect(contentsControl.compareDocumentPosition(readingTime) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
};

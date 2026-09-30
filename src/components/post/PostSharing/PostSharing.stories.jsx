import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PostSharing from './index';

const docs = getComponentDocs('Post/PostSharing');
const siteMetadata = {
  github: 'https://github.com/ahmadassaf/blog',
  postsRepo: 'https://github.com/ahmadassaf/blog-posts',
  siteUrl: 'https://ahmadassaf.com'
};
const shareUrl = (canvas) => new URL(canvas.getByRole('link', { name: 'Share post on X' }).href);

export default {
  title: 'Post/PostSharing',
  component: PostSharing,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', slug: 'text', tags: 'object', externalLink: 'text' }),
  args: {
    externalLink: 'engineering/design-systems',
    siteMetadata,
    slug: 'design-systems',
    tags: ['design systems', 'react'],
    title: 'Design systems keep editorial rhythm predictable'
  },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  parameters: {
    docs: { source: playgroundSource('PostSharing', { imports: "import { PostSharing } from '@gaudi/design-system';" }) }
  },
  render: (args) => <PostSharing {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const url = shareUrl(canvas);
    await expect(url.origin + url.pathname).toBe('https://x.com/share');
    await expect(url.searchParams.get('text')).toBe(args.title);
    await expect(url.searchParams.get('url')).toBe(`${siteMetadata.siteUrl}/blog/${args.slug}`);
    await expect(url.searchParams.get('hashtags')).toBe('designsystems,react');
    await expect(canvas.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute('href', siteMetadata.github);
    await expect(canvas.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('href', `${siteMetadata.postsRepo}/blob/master/${args.externalLink}.mdx`);
  }
};

export const WithoutTags = {
  args: { tags: undefined },
  parameters: { docs: { description: { story: 'Without `tags` the share link sends an empty hashtag list and the source link still renders.' } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(shareUrl(canvas).searchParams.get('hashtags')).toBe('');
    await expect(canvas.getByRole('link', { name: 'View on GitHub' })).toBeInTheDocument();
  }
};

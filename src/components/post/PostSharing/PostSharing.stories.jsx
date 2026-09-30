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
const hashtag = (tag) => String(tag).replace(/\s+/g, '');
const articleUrl = (slug) => `${siteMetadata.siteUrl}/blog/${slug}`;
// What the X share link carries, so the title, slug, and tags controls are visible in the preview.
const SharePreview = ({ slug, tags = [], title }) => (
  <figure aria-label='Share preview' className='grid gap-1 rounded-lg border border-gray-200 p-3 text-sm dark:border-border-dark'>
    <strong className='font-semibold text-gray-900 dark:text-gray-100'>{title}</strong>
    <span className='truncate text-xs text-gray-500 dark:text-gray-400'>{articleUrl(slug)}</span>
    {tags.length ? <span className='text-xs text-blue-600 dark:text-blue-400'>{tags.map((tag) => `#${hashtag(tag)}`).join(' ')}</span> : null}
  </figure>
);
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
    tags: ['design systems', 'react', 'accessibility'],
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
    docs: {
      description: { story: 'The share and source actions above a preview of what the X link carries. `title`, `slug`, and `tags` rewrite the shared text, URL, and hashtags; clearing `externalLink` removes the View on GitHub link.' },
      source: playgroundSource('PostSharing', { imports: "import { PostSharing } from '@gaudi/design-system';" })
    }
  },
  render: (args) => (
    <div className='grid gap-2'>
      <PostSharing {...args} className='my-0' />
      <SharePreview {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const url = shareUrl(canvas);
    const hashtags = (args.tags || []).map(hashtag);
    await expect(url.origin + url.pathname).toBe('https://x.com/share');
    await expect(url.searchParams.get('text')).toBe(args.title);
    await expect(url.searchParams.get('url')).toBe(articleUrl(args.slug));
    await expect(url.searchParams.get('hashtags')).toBe(hashtags.join(','));
    const preview = within(canvas.getByRole('figure', { name: 'Share preview' }));
    await expect(preview.getByText(args.title)).toBeVisible();
    await expect(preview.getByText(articleUrl(args.slug))).toBeVisible();
    if (hashtags.length) await expect(preview.getByText(hashtags.map((tag) => `#${tag}`).join(' '))).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute('href', siteMetadata.github);
    const source = canvas.queryByRole('link', { name: 'View on GitHub' });
    if (args.externalLink) await expect(source).toHaveAttribute('href', `${siteMetadata.postsRepo}/blob/master/${args.externalLink}.mdx`);
    else await expect(source).not.toBeInTheDocument();
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

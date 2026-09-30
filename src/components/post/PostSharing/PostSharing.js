/**
 * Post Sharing Component
 *
 * @description A component that provides social sharing functionality for blog posts, including
 * X sharing and GitHub repository links. It generates appropriate URLs for sharing and
 * viewing the post source code on GitHub.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */


import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';

const safeUrlProtocols = new Set([ 'http:', 'https:' ]);

const isSafeAbsoluteUrl = (value) => {
  try {
    return safeUrlProtocols.has(new URL(value).protocol);
  } catch {
    return false;
  }
};

const encodePath = (value) => String(value || '')
  .replace(/^\/+/, '')
  .replace(/\.mdx$/i, '')
  .split('/')
  .filter(Boolean)
  .map((segment) => encodeURIComponent(segment))
  .join('/');

const buildEditUrl = (siteMetadata = {}, externalLink) => {
  if (!siteMetadata.postsRepo || !externalLink || !isSafeAbsoluteUrl(siteMetadata.postsRepo)) return null;

  const repoUrl = siteMetadata.postsRepo.replace(/\/+$/, '');
  const sourcePath = encodePath(externalLink);

  return sourcePath ? `${repoUrl}/blob/master/${sourcePath}.mdx` : null;
};

const buildShareTarget = (siteMetadata = {}, slug, externalLink) => {
  if (siteMetadata.siteUrl && slug && isSafeAbsoluteUrl(siteMetadata.siteUrl)) {
    const baseUrl = siteMetadata.siteUrl.endsWith('/') ? siteMetadata.siteUrl : `${siteMetadata.siteUrl}/`;

    return new URL(`blog/${encodePath(slug)}`, baseUrl).href;
  }

  return isSafeAbsoluteUrl(externalLink) ? externalLink : '';
};

const buildShareUrl = ({ externalLink, siteMetadata, slug, tags, title }) => {
  const shareUrl = new URL('https://x.com/share');
  const hashtags = Array.isArray(tags) ? tags.map((tag) => String(tag).replace(/\s+/g, '')).filter(Boolean).join(',') : '';

  shareUrl.searchParams.set('text', title || '');
  shareUrl.searchParams.set('url', buildShareTarget(siteMetadata, slug, externalLink));
  shareUrl.searchParams.set('hashtags', hashtags);

  return shareUrl.href;
};

/**
 * Post sharing component with social media and GitHub integration
 *
 * @description Renders sharing buttons and links for blog posts, including X share functionality
 * with hashtags and a direct link to view the post source on GitHub. Handles URL encoding and
 * provides proper social media integration.
 *
 * @param {Object} props - Component props
 * @param {Object} props.siteMetadata - Site metadata containing repository and URL information
 * @param {string} props.slug - The post slug for URL generation
 * @param {string} props.title - The post title for sharing
 * @param {Array<string>} props.tags - Array of post tags for hashtag generation
 * @param {string} props.externalLink - The external link or file path for the post
 *
 * @returns {JSX.Element} The rendered post sharing component
 *
 * @example
 * <PostSharing
 *   siteMetadata={siteMetadata}
 *   slug="my-blog-post"
 *   title="My Blog Post Title"
 *   tags={["javascript", "react"]}
 *   externalLink="content/blog/my-post"
 * />
 */
const PostSharing = ({ className, classNames = {}, siteMetadata, slug, title, tags, externalLink }) => {
  const editUrl = buildEditUrl(siteMetadata, externalLink);
  const shareUrl = buildShareUrl({ externalLink, siteMetadata, slug, tags, title });

  return (
    <div className={ cn('my-4 flex pt-4 text-sm text-text-muted max-sm:text-xs', className, classNames.root) }>
      <div className={ cn('mr-2 flex gap-2 hover:text-accent', classNames.action) }>
        <Icon kind='twitter' href={ shareUrl } label='Share post on X' />
      </div>
      <div className={ cn('mr-4 flex items-center gap-2 hover:text-accent', classNames.source) }>
        <Icon kind='github' href={ siteMetadata?.github } />
        {editUrl ? <Link href={ editUrl } className={ classNames.link }>View on GitHub</Link> : null}
      </div>
    </div>
  );
};

export default PostSharing;

import Icon from '@gaudi/design-system/core/Icon';
import Link from '@gaudi/design-system/core/Link';

// The publishing app prepares its service URLs, branch and content path.
export const articleActions = {
  share: 'https://x.com/share?text=Design%20systems%20keep%20editorial%20rhythm%20predictable&url=https%3A%2F%2Fexample.com%2Farticles%2Fdesign-systems&hashtags=designsystems%2Creact%2Caccessibility',
  repository: 'https://github.com/example/publication',
  source: 'https://github.com/example/publication/blob/main/content/design-systems.mdx'
};

export function ArticleActions() {
  return (
    <nav aria-label='Article actions' className='my-4 flex flex-wrap items-center gap-4 text-sm'>
      <Icon kind='twitter' href={articleActions.share} label='Share post on X' />
      <Icon kind='github' href={articleActions.repository} label='Publication repository' />
      <Link href={articleActions.source}>View article source</Link>
    </nav>
  );
}

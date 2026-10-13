export const topNav = [
  { label: 'Docs', href: '/docs', match: ['/docs/getting-started', '/docs/foundations', '/docs/theming', '/docs/ai', '/docs/credits'] },
  { label: 'Components', href: '/docs/components' },
  { label: 'Blocks', href: '/docs/blocks' },
  { label: 'Chat & Agents', href: '/docs/chat' },
  { label: 'Charts', href: '/docs/charts' },
  { label: 'Hooks', href: '/docs/hooks' },
  { label: 'Themes', href: '/themes' }
] as const;

export const isActive = (pathname: string, item: (typeof topNav)[number]) => {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if ('match' in item) return normalized === item.href || item.match.some((prefix) => normalized.startsWith(prefix));
  return normalized === item.href || normalized.startsWith(`${item.href}/`);
};

/** Prefix for raw URLs (iframes, assets) when the site is deployed under a sub-path. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

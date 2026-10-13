/** Site-wide settings. Override the URLs with NEXT_PUBLIC_* variables at build time. */
export const siteConfig = {
  name: 'Gaudi',
  product: 'Gaudi Design System',
  description: 'A curated React design system for blogs and applications: tokens, components, blocks, charts, chat parts, hooks and themes.',
  github: 'https://github.com/g-udi/design-system',
  /** Storybook for "View in Storybook" links: the dev server locally, storybook.gaudi.site in production. */
  storybookUrl: process.env.NEXT_PUBLIC_STORYBOOK_URL || (process.env.NODE_ENV === 'production' ? 'https://storybook.gaudi.site' : 'http://localhost:6006'),
  /** Storybook for embedded examples: the same-origin build under /storybook in production, so frames size themselves. */
  storybookEmbedUrl: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/storybook` : (process.env.NEXT_PUBLIC_STORYBOOK_URL || 'http://localhost:6006'),
  /** Origin that serves the shadcn registry items at /r/<name>.json. */
  registryUrl: process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://design.gaudi.site',
  /** The package installs from its GitHub repository and imports as `packageName`. */
  installSpec: 'github:g-udi/design-system',
  packageName: '@gaudi/design-system'
} as const;

export const storybookStoryUrl = (id: string) => `${siteConfig.storybookUrl}/index.html?path=/${id.endsWith('--docs') ? 'docs' : 'story'}/${id}`;

/**
 * Absolute origin of the deployed site, used for `metadataBase`, the sitemap and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL at build time once hosting is chosen; defaults to the local dev server.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3410}`).replace(/\/+$/, '');

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Absolute URL for a site path, including any sub-path deployment prefix. */
export const absoluteUrl = (pathname: string) => `${siteUrl}${basePath}${pathname === '/' ? '/' : pathname}`;

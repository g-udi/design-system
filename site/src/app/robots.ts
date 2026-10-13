import type { MetadataRoute } from 'next';
import { absoluteUrl, siteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Isolated example documents and the search index are not pages of their own.
      disallow: [absoluteUrl('/preview/').slice(siteUrl.length), absoluteUrl('/api/').slice(siteUrl.length)]
    },
    sitemap: absoluteUrl('/sitemap.xml')
  };
}

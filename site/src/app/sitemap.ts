import type { MetadataRoute } from 'next';
import { catalogue } from '@/lib/catalogue';
import { source } from '@/lib/source';
import { absoluteUrl } from '@/lib/site-url';

// Prerendered so it is emitted by the static export too.
export const dynamic = 'force-static';

const trailingSlash = process.env.STATIC_EXPORT === '1';
const withSlash = (pathname: string) => (trailingSlash && !pathname.endsWith('/') ? `${pathname}/` : pathname);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = catalogue.generatedAt;
  const docs = source.getPages().map((page) => ({
    url: absoluteUrl(withSlash(page.url)),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: page.url === '/docs' ? 0.9 : page.slugs.length === 1 ? 0.8 : 0.6
  }));
  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl(withSlash('/themes')), lastModified, changeFrequency: 'monthly', priority: 0.5 },
    ...docs
  ];
}

import { notFound } from 'next/navigation';
import { ogImage, pageEyebrow } from '@/lib/og';
import { source } from '@/lib/source';

/**
 * Social card per docs page at /og/docs/<slug>/image.png (/og/docs/image.png for /docs).
 * A route handler rather than `docs/[[...slug]]/opengraph-image`: metadata image files cannot sit
 * under a catch-all segment. The `.png` last segment keeps static-export output servable as PNG.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return source.generateParams().map(({ slug }) => ({ slug: [...(slug ?? []), 'image.png'] }));
}

export async function GET(_request: Request, props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
  if (slug.at(-1) !== 'image.png') notFound();
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();
  return ogImage({ eyebrow: pageEyebrow(page), title: page.data.title, description: page.data.description });
}

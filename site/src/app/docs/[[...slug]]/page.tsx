import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { mdxComponents } from '@/components/docs/mdx-components';
import { DocsShell } from '@/components/site/DocsShell';
import { PageActions } from '@/components/site/PageActions';
import { PageFooter } from '@/components/site/PageFooter';
import { Toc } from '@/components/site/Toc';
import { markdownPath, pageOrigin } from '@/lib/llms';
import { source } from '@/lib/source';

export default async function DocsPage(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const MDX = page.data.body;
  const full = page.data.full === true;
  // Resolved while prerendering: git dates, source links and the sidebar neighbours.
  const origin = pageOrigin(page);
  const { previous, next } = findNeighbour(source.pageTree, page.url);
  return (
    <DocsShell tree={source.pageTree} aside={full ? undefined : <Toc items={page.data.toc} />}>
      {/* One child: a server-rendered array would reach the client shell as an unkeyed list. */}
      <>
      <article className='site-prose prose' data-full={full ? 'true' : undefined}>
        <h1 className='mb-2 [overflow-wrap:anywhere]'>{page.data.title}</h1>
        {page.data.description ? <p className='mt-0 text-lg text-text-muted'>{page.data.description}</p> : null}
        <PageActions markdownUrl={markdownPath(page.url)} sourceUrl={origin.sourceUrl} />
        <MDX components={mdxComponents} />
      </article>
      <PageFooter previous={previous} next={next} lastModified={origin.lastModified} editUrl={origin.editUrl} />
      </>
    </DocsShell>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
    // Social card rendered by src/app/og/docs/[...slug]/route.tsx.
    openGraph: { title: page.data.title, description: page.data.description, siteName: 'Gaudi Design System', type: 'article', url: page.url, images: { url: `/og/docs/${[...page.slugs, 'image.png'].join('/')}`, width: 1200, height: 630, alt: page.data.title } },
    twitter: { card: 'summary_large_image', title: page.data.title, description: page.data.description, images: `/og/docs/${[...page.slugs, 'image.png'].join('/')}` }
  };
}

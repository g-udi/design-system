import { markdownHeaders, markdownSlug, pageFromMarkdownSlug, pageMarkdown } from '@/lib/llms';
import { source } from '@/lib/source';

// Markdown for every docs page, prerendered as /md/<slug>.md (the overview is /md/index.md), so
// a static export ships real .md files. On a server, src/proxy.ts also serves these at
// /docs/<slug>.md and for `Accept: text/markdown`.
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: markdownSlug(page) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const page = pageFromMarkdownSlug((await params).slug);
  if (!page) return new Response('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  return new Response(pageMarkdown(page), { headers: markdownHeaders });
}

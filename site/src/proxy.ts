import { NextResponse, type NextRequest } from 'next/server';

// Markdown for language models on a server deployment (a static export has no proxy; its
// Markdown files are prerendered instead):
//   /docs.md, /docs/index.md, /docs/<slug>.md   -> /md/index.md, /md/<slug>.md
//   /docs/<slug> with Accept preferring text/markdown over text/html -> the same Markdown
// Markdown responses carry `Vary: Accept`. (HTML pages keep Next's own Vary: the app renderer
// replaces the header, so a CDN in front should key on Accept for /docs as well.)

/** Highest q-value the Accept header gives any of the media types (0 when absent). */
function quality(accept: string, types: string[]) {
  let best = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    if (!types.includes(type.trim())) continue;
    const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='));
    const value = q ? Number.parseFloat(q.slice(2)) : 1;
    if (Number.isFinite(value)) best = Math.max(best, value);
  }
  return best;
}

const prefersMarkdown = (accept: string | null) => {
  if (!accept) return false;
  const markdown = quality(accept, ['text/markdown', 'text/x-markdown']);
  return markdown > 0 && markdown > quality(accept, ['text/html', 'application/xhtml+xml']);
};

const withVary = (response: NextResponse) => {
  const vary = response.headers.get('Vary');
  if (!vary?.split(',').some((value) => value.trim().toLowerCase() === 'accept')) response.headers.set('Vary', vary ? `${vary}, Accept` : 'Accept');
  return response;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let slug: string | null = null;
  if (pathname === '/docs.md' || pathname === '/docs/index.md') slug = '';
  else if (pathname.startsWith('/docs/') && pathname.endsWith('.md')) slug = pathname.slice('/docs/'.length, -'.md'.length);
  else if (prefersMarkdown(request.headers.get('accept')) && !request.headers.has('rsc')) slug = pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
  if (slug === null) return NextResponse.next();
  // The prerendered Markdown route: /md/<slug>.md, /md/index.md for the overview.
  const url = request.nextUrl.clone();
  url.pathname = `/md/${slug || 'index'}.md`;
  return withVary(NextResponse.rewrite(url));
}

export const config = {
  matcher: ['/docs', '/docs.md', '/docs/:path*']
};

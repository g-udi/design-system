import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const mdx = await loadComponent(new URL('../../mdx/Preview/index.js', import.meta.url));
const { normalizeLinkPreview: normalize, detectLinkKind, resolvePreviewRequest, getPreviewImageUrl } = api;

test('LinkPreview publishes the component, parts, normaliser and data hook', () => {
  for (const name of [ 'default', 'LinkPreviewCard', 'LinkPreviewCompact', 'LinkPreviewSkeleton', 'normalizeLinkPreview', 'usePreviewData', 'clearPreviewCache' ]) assert.ok(api[name], name);
});

test('the normaliser detects the kind of a link from the payload type and the URL', () => {
  const kinds = {
    '/blog/engineering/post': 'internal',
    'https://github.com/vercel/next.js': 'repository',
    'https://www.youtube.com/watch?v=qh3NGpYRG3I': 'video',
    'https://youtu.be/qh3NGpYRG3I': 'video',
    'https://x.com/rauchg/status/1': 'social',
    'https://en.wikipedia.org/wiki/Knowledge_graph': 'wikipedia',
    'https://www.npmjs.com/package/react': 'package',
    'https://developer.mozilla.org/en-US/docs/Web/HTML': 'docs',
    'https://example.com/docs/start': 'docs',
    'https://example.com/diagram.png': 'image',
    'https://example.com/paper.pdf': 'file',
    'https://medium.com/@a/post': 'article',
    'https://example.com': 'website'
  };
  for (const [ url, kind ] of Object.entries(kinds)) assert.equal(detectLinkKind(url, {}), kind, url);
  assert.equal(detectLinkKind('https://example.com', { 'publishedTime': '2026-01-01' }), 'article');
  assert.equal(detectLinkKind('https://example.com', { 'type': 'video' }), 'video');
});

test('repository previews show owner/repo, the GitHub card and stats when the endpoint provides them', () => {
  const preview = normalize({ 'description': 'vercel/next.js on GitHub', 'forks': 27000, 'language': 'JavaScript', 'stars': 128400 }, { 'url': 'https://github.com/vercel/next.js' });
  assert.equal(preview.kind, 'repository');
  assert.equal(preview.title, 'vercel/next.js');
  assert.equal(preview.description, '', 'the synthesized "on GitHub" description is noise');
  assert.equal(preview.image, 'https://opengraph.githubassets.com/1/vercel/next.js');
  assert.deepEqual(preview.stats.map((item) => item.text), [ 'JavaScript', '128.4K', '27K' ]);
  assert.equal(preview.stats[1].label, '128.4K stars');
});

test('video, article, post, wikipedia, package, image and file previews carry their own rich fields', () => {
  const video = normalize({ 'author': 'Gaudi', 'duration': 'PT12M41S', 'title': 'Tokens - YouTube' }, { 'url': 'https://youtu.be/abc123' });
  assert.equal(video.videoId, 'abc123');
  assert.equal(video.duration, '12:41');
  assert.equal(video.title, 'Tokens');
  assert.equal(video.image, 'https://img.youtube.com/vi/abc123/maxresdefault.jpg');
  assert.ok(video.meta.some((item) => item.id === 'channel' && item.text === 'Gaudi'));

  const article = normalize({ 'author': 'Ahmad', 'publishedTime': '2026-06-05', 'readingTime': '8 min read', 'title': 'Post' }, { 'url': 'https://medium.com/@a/post' });
  assert.equal(article.kind, 'article');
  assert.equal(article.icon, 'Medium');
  assert.deepEqual(article.meta.map((item) => item.text), [ 'Ahmad', 'June 5, 2026', '8 min read' ]);

  const post = normalize({ 'description': 'Shipping today.', 'likes': 1200 }, { 'url': 'https://x.com/gaudi/status/42' });
  assert.equal(post.author, '@gaudi');
  assert.equal(post.stats[0].text, '1.2K');

  const wiki = normalize({ 'articleName': 'Knowledge graph', 'excerpt': 'A knowledge graph…' }, { 'url': 'https://en.wikipedia.org/wiki/Knowledge_graph' });
  assert.equal(wiki.title, 'Knowledge graph');
  assert.equal(wiki.image, null, 'Wikipedia shows its excerpt instead of a screenshot');

  const pkg = normalize({}, { 'url': 'https://www.npmjs.com/package/@scope/name' });
  assert.equal(pkg.title, '@scope/name');
  assert.ok(pkg.favicon);

  assert.equal(normalize({}, { 'url': 'https://example.com/a.png' }).image, 'https://example.com/a.png');
  assert.equal(normalize({}, { 'url': 'https://example.com/paper.pdf' }).label, 'PDF');
});

test('titles, failures and the screenshot fallback follow the blog rules', () => {
  assert.equal(normalize({ 'title': 'GitHub - owner/repo: A thing' }, { 'url': 'https://github.com/owner/repo' }).title, 'owner/repo');
  assert.equal(normalize({ 'title': 'Array - MDN Web Docs' }, { 'url': 'https://developer.mozilla.org/x' }).title, 'Array');
  assert.ok(normalize({ 'title': 'x'.repeat(80) }, { 'url': 'https://example.com' }).title.endsWith('...'));
  const gone = normalize({ 'error': true, 'status': 404 }, { 'title': 'Old', 'url': 'https://example.com' });
  assert.equal(gone.status, 'error');
  assert.equal(gone.unavailable, true);
  assert.equal(normalize({ 'error': true, 'status': 429 }, { 'url': 'https://example.com' }).unavailable, false);
  assert.equal(normalize({}, { 'url': 'https://example.com' }).image, null, 'Core never calls the screenshot service by default');
  assert.match(normalize({}, { 'screenshotFallback': true, 'url': 'https://example.com' }).image, /microlink/);
  assert.match(getPreviewImageUrl('https://example.com', {}), /microlink/, 'the legacy helper keeps the blog default');
  assert.equal(normalize({ 'title': 'Post', 'type': 'internal' }, { 'url': '/blog/post' }).image, null);
});

test('the preview endpoint is configurable and can be turned off', () => {
  assert.equal(resolvePreviewRequest('/api/preview', 'https://a.dev/?q=1'), '/api/preview?url=https%3A%2F%2Fa.dev%2F%3Fq%3D1');
  assert.equal(resolvePreviewRequest('/api/meta?v=2', 'https://a.dev'), '/api/meta?v=2&url=https%3A%2F%2Fa.dev');
  assert.equal(resolvePreviewRequest((url) => `/p/${encodeURIComponent(url)}`, 'https://a.dev'), '/p/https%3A%2F%2Fa.dev');
  assert.equal(resolvePreviewRequest(null, 'https://a.dev'), null);
});

test('every variant renders on the server from static data, and failures stay plain links', () => {
  const Component = api.default;
  const data = { 'description': 'Personal website.', 'image': '/og.png', 'siteName': 'assaf.website', 'title': 'assaf.website' };
  const inline = renderToStaticMarkup(createElement(Component, { 'previewData': data, 'url': 'https://assaf.website' }));
  assert.match(inline, /href="https:\/\/assaf.website"/);
  assert.match(inline, /aria-label="assaf.website - assaf.website"/);
  const card = renderToStaticMarkup(createElement(Component, { 'previewData': data, 'url': 'https://assaf.website', 'variant': 'card' }));
  assert.match(card, /data-slot="link-preview-card"/);
  assert.match(card, /<h3/);
  assert.match(renderToStaticMarkup(createElement(Component, { 'previewData': data, 'url': 'https://assaf.website', 'variant': 'compact' })), /data-slot="link-preview-compact"/);
  const gone = renderToStaticMarkup(createElement(Component, { 'previewData': { 'error': true, 'status': 410 }, 'title': 'Old', 'url': 'https://gone.invalid', 'variant': 'card' }));
  assert.match(gone, /\(link may be unavailable\)/);
  const offline = renderToStaticMarkup(createElement(Component, { 'endpoint': null, 'title': 'Docs', 'url': 'https://example.com' }));
  assert.match(offline, /data-slot="link-preview-fallback"/);
});

test('the MDX Preview stays a drop-in adapter over the core owner', () => {
  assert.ok(mdx.default && mdx.PreviewLoadingSkeleton && mdx.usePreviewData);
  const html = renderToStaticMarkup(createElement(mdx.default, { 'previewData': { 'siteName': 'Internal', 'title': 'Post', 'type': 'internal' }, 'title': 'the post', 'url': '/blog/post' }));
  assert.match(html, /data-preview-internal="true"/);
  assert.match(html, /aria-label="the post - Internal"/);
});

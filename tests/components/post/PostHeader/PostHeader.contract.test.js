import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const frontMatter = { title: 'Prepared labels', category: 'eBay', tags: ['iOS', 'a11y'] };

test('PostHeader changes typography without changing title or subtitle semantics', async () => {
  const path = new URL('../../../../src/components/post/PostHeader/index.js', import.meta.url);
  const metadata = { title: 'Compact article', subtitle: 'A readable introduction' };
  const compact = await renderComponent(path, { frontMatter: metadata, titleLevel: 2, titleVariant: 'heading-lg', subtitleVariant: 'paragraph-md' });
  assert.match(compact, /<h2 class="[^"]*text-3xl[^"]*md:text-4xl[^"]*">Compact article<\/h2>/);
  assert.match(compact, /<p class="[^"]*text-base[^"]*">A readable introduction<\/p>/);
  const defaultHeader = await renderComponent(path, { frontMatter: metadata });
  assert.match(defaultHeader, /<h1 class="[^"]*md:text-5xl[^"]*">Compact article<\/h1>/);
});

test('PostHeader preserves host category and tag casing', async () => {
  const html = await renderComponent(new URL('../../../../src/components/post/PostHeader/index.js', import.meta.url), { frontMatter });
  assert.match(html, />eBay<|eBay<\/a>/);
  assert.match(html, />iOS</);
  assert.doesNotMatch(html, /EBay/);
  for (const link of html.matchAll(/<a\b[^>]*>/g)) assert.doesNotMatch(link[0], /capitalize/);
});

test('Post cards preserve the supplied category presentation', async () => {
  const html = await renderComponent(new URL('../../../../src/components/post/Post/index.js', import.meta.url), { frontMatter: { ...frontMatter, slug: 'labels' } });
  assert.match(html, /eBay/);
  assert.doesNotMatch(html, /capitalize/);
});

test('Post and PostHeader preserve prepared destinations, labels and unlinked metadata', async () => {
  const prepared = {
    id: 0,
    title: 'Prepared destinations',
    href: '/journal/entry?edition=0#intro',
    date: '2026-10-01',
    category: { id: 0, label: 'eBay', href: '/collections/CaseSensitive' },
    tags: [{ id: 0, label: 'iOS', href: '/labels/iOS?sort=0' }, { id: 'plain', label: 'a11y' }]
  };
  const card = await renderComponent(new URL('../../../../src/components/post/Post/index.js', import.meta.url), { frontMatter: prepared });
  assert.match(card, /href="\/journal\/entry\?edition=0#intro"/);
  assert.match(card, /href="\/collections\/CaseSensitive"/);
  const header = await renderComponent(new URL('../../../../src/components/post/PostHeader/index.js', import.meta.url), { frontMatter: prepared });
  assert.match(header, /href="\/collections\/CaseSensitive"/);
  assert.match(header, /href="\/labels\/iOS\?sort=0"/);
  assert.match(header, />a11y</);
  // A calendar date keeps its day in every timezone, in the short month style.
  assert.match(header, /<time dateTime="2026-10-01"[^>]*>Oct 1, 2026<\/time>/);
  assert.doesNotMatch(header, /href="[^"]*a11y/);
  const unlinked = await renderComponent(new URL('../../../../src/components/post/Post/index.js', import.meta.url), { frontMatter: { title: 'No destination', slug: 'must-not-be-a-route', category: 'eBay' } });
  assert.doesNotMatch(unlinked, /<a\b|\/blog|\/thoughts/);
});

test('PostNavigation uses prepared hrefs independently of its content label', async () => {
  const path = new URL('../../../../src/components/post/PostNavigation/index.js', import.meta.url);
  const html = await renderComponent(path, { type: 'Thought', prev: { id: 0, title: 'Earlier', href: '/notes/previous?item=0' }, next: { title: 'Unpublished', slug: 'no-route' } });
  assert.match(html, /Previous Thought/);
  assert.match(html, /href="\/notes\/previous\?item=0"/);
  assert.doesNotMatch(html, /Unpublished|\/thoughts|\/blog/);
  assert.equal(await renderComponent(path, { next: { title: 'No destination' } }), '');
});

test('PostSeriesBox identifies zero IDs without marking an absent selection current', async () => {
  const path = new URL('../../../../src/components/post/PostSeriesBox/index.js', import.meta.url);
  const series = [{ id: 0, title: 'First', series: 'A series', href: '/reading/zero', order: 0 }, { id: 'next', title: 'Next', series: 'A series', href: '/reading/next' }];
  const selected = await renderComponent(path, { series, currentId: 0 });
  assert.match(selected, /aria-valuenow="1"/);
  assert.match(selected, /aria-valuemax="2"/);
  const absent = await renderComponent(path, { series });
  assert.match(absent, /aria-valuenow="0"/);
});

test('PostHeader shows the reading time with or without a contents control', async () => {
  const path = new URL('../../../../src/components/post/PostHeader/index.js', import.meta.url);
  const frontMatter = { title: 'Linked data quality', readingTime: { text: '36 min read' } };
  assert.match(await renderComponent(path, { frontMatter }), />36 min read</);
  const withControl = await renderComponent(path, { frontMatter, tocControl: 'Show contents' });
  assert.match(withControl, />36 min read<\/span>.*Show contents/s);
  assert.match(withControl, />36 min read</);
  assert.doesNotMatch(await renderComponent(path, { frontMatter: { title: 'Untimed' } }), /min read/);
});

test('PostHeader labels the date only for a revision after the publication day', async () => {
  const path = new URL('../../../../src/components/post/PostHeader/index.js', import.meta.url);
  const post = { title: 'Knowledge graphs', category: 'Data', date: '2021-02-22' };
  for (const updatedAt of [undefined, post.date, '2021-02-22T17:00:00Z', '2021-02-21']) {
    const html = await renderComponent(path, { frontMatter: { ...post, updatedAt } });
    assert.ok(html.includes(`<time dateTime="${updatedAt || post.date}"`));
    assert.doesNotMatch(html, /Updated at/);
  }
  const undated = await renderComponent(path, { frontMatter: { updatedAt: '2026-11-18' } });
  assert.match(undated, /<time dateTime="2026-11-18"/);
  assert.doesNotMatch(undated, /Updated at/);
  const invalid = await renderComponent(path, { frontMatter: { ...post, updatedAt: 'invalid' } });
  assert.doesNotMatch(invalid, /Updated at/);
  assert.match(invalid, /<time dateTime="2021-02-22"/);
  const legacy = await renderComponent(path, { frontMatter: { ...post, updated: '2024-11-29' } });
  assert.match(legacy, /<time dateTime="2024-11-29"/);
  assert.doesNotMatch(legacy, /Updated at/);
  assert.match(legacy, />·<\/span>/);
  const revised = await renderComponent(path, { frontMatter: { ...post, updated: '2024-11-29', updatedAt: '2026-11-18' } });
  assert.doesNotMatch(revised, />·<\/span>/);
  assert.match(revised, /data-variant="soft"[^>]*><span>Updated at<\/span><\/span><time dateTime="2026-11-18"/);
});

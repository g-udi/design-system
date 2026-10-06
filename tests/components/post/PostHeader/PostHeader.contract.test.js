import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const frontMatter = { title: 'Prepared labels', category: 'eBay', tags: ['iOS', 'a11y'] };

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

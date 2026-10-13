import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderComponent } from '../../../support/renderComponent.js';

const component = new URL('../../../../src/components/post/Post/index.js', import.meta.url);

test('post media and footer preserve list semantics, heading level, and supplied links', async () => {
  const html = await renderComponent(component, {
    frontMatter: { title: 'Read this article', href: '/journal/article', date: '2026-10-13', subtitle: 'An introduction.', category: { label: 'Research', href: '/topics/research' } },
    layout: 'horizontal', titleAs: 'h2',
    media: createElement('img', { src: '/cover.svg', alt: 'An abstract cover' }),
    footer: '12 min read'
  });
  assert.match(html, /<li /);
  assert.match(html, /<article /);
  assert.match(html, /<h2/);
  assert.match(html, /href="\/journal\/article"/);
  assert.match(html, /href="\/topics\/research"/);
  assert.match(html, /alt="An abstract cover"/);
  assert.ok(html.indexOf('An abstract cover') < html.indexOf('Read this article'));
  assert.ok(html.indexOf('12 min read') > html.indexOf('Read this article'));
});

test('text-only posts do not fabricate media, a footer, or a destination', async () => {
  const html = await renderComponent(component, { frontMatter: { title: 'Draft note', date: '2026-10-13', draft: true } });
  assert.doesNotMatch(html, /<img|href=|gaudi-post-footer/);
  assert.match(html, /Draft note/);
  assert.match(html, />Draft</);
});

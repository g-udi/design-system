import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const path = new URL('../../../../src/components/post/TableOfContents/index.js', import.meta.url);

test('TableOfContents renders real nested links during SSR with ordinary article heading depths', async () => {
  const html = await renderComponent(path, {
    toc: [{ id: 'intro', value: 'Getting started', depth: 2, children: [{ id: 'setup', value: 'Setup', depth: 3 }] }],
    indexVisuals: false, 'aria-label': 'Article sections'
  });
  assert.match(html, /<nav[^>]*aria-label="Article sections"/);
  assert.match(html, /href="#intro"/);
  assert.match(html, /href="#setup"/);
  assert.match(html, /aria-label="Collapse Getting started"/);
  assert.match(html, /aria-expanded="true"/);
});

test('TableOfContents does not render an empty navigation region', async () => {
  assert.equal(await renderComponent(path, { toc: [], indexVisuals: false }), '');
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/core/Skeleton/index.js', import.meta.url));

test('Skeleton blocks are decorative', () => {
  assert.match(renderToStaticMarkup(h(api.default, { className: 'h-4' })), /aria-hidden="true"/);
});

test('Shimmer keeps its words as text and sizes its sweep from them', () => {
  const html = renderToStaticMarkup(h(api.Shimmer, { as: 'p', duration: 3, spread: 2 }, 'Searching the web…'));
  assert.match(html, /^<p data-slot="shimmer" data-active=""/);
  assert.match(html, /class="ds-part-shimmer shimmer"/);
  assert.match(html, /--ds-shimmer-duration:3s/);
  assert.match(html, /--ds-shimmer-spread:36px/);
  assert.match(html, />Searching the web…<\/p>$/);
  const resting = renderToStaticMarkup(h(api.Shimmer, { active: false }, 'Thought for 4s'));
  assert.doesNotMatch(resting, / shimmer"|--ds-shimmer|data-active/);
  assert.match(resting, />Thought for 4s</);
});

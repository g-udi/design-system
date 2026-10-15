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

test('SkeletonMorph is busy with a status label and shows placeholders until loaded', () => {
  const region = (loading) => renderToStaticMarkup(h(api.SkeletonMorph, { loading, label: 'Loading profile' },
    h(api.SkeletonMorphBlock, { width: 120, lines: 2 }, h('p', null, 'Mara Lindqvist')),
    h(api.SkeletonMorphBlock, { shape: 'circle', width: 48, height: 48 }, h('img', { alt: '' }))));
  const loading = region(true);
  assert.match(loading, /^<div data-slot="skeleton-morph" aria-busy="true">/);
  assert.match(loading, /<span role="status" class="sr-only">Loading profile<\/span>/);
  assert.equal(loading.match(/data-slot="skeleton"/g).length, 3);
  assert.match(loading, /width:60%/);
  assert.match(loading, /rounded-full[^>]*width:48px;height:48px/);
  assert.doesNotMatch(loading, /Mara Lindqvist|<img/);
  const loaded = region(false);
  assert.doesNotMatch(loaded, /aria-busy|data-slot="skeleton"[ >]/);
  assert.match(loaded, /<span role="status" class="sr-only"><\/span>/);
  assert.match(loaded, /Mara Lindqvist/);
  assert.match(loaded, /<img alt=""/);
});

test('Skeleton can render as a span so placeholders stay valid inside text', () => {
  assert.match(renderToStaticMarkup(h(api.default, { as: 'span', className: 'inline-block h-4' })), /^<span data-slot="skeleton"/);
  assert.match(renderToStaticMarkup(h(api.default, { className: 'h-4' })), /^<div data-slot="skeleton"/);
});

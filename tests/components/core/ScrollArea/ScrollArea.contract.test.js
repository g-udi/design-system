import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/ScrollArea/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/ScrollArea/stories/fixtures/scroll-area/scroll-area-horizontal-gallery.jsx', import.meta.url));

test('ScrollArea publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.ScrollArea, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('smooth ScrollArea preserves server content, region naming and scrollbar customization', () => {
  const props = { smooth: true, 'aria-labelledby': 'article-title', type: 'always', scrollbarClassName: { track: 'reading-track', thumb: 'reading-thumb' } };
  const article = createElement('article', null, createElement('h2', { id: 'article-title' }, 'A place to read'), createElement('p', null, 'The article is available before hydration.'));
  const html = renderToStaticMarkup(createElement(publicAPI.ScrollArea, props, article));
  assert.match(html, /The article is available before hydration/);
  assert.match(html, /role="region" aria-labelledby="article-title"/);
  assert.equal((html.match(/aria-labelledby="article-title"/g) || []).length, 1);
  assert.doesNotMatch(html, /aria-label="Scrollable content"|smooth="|viewportRef=|scrollbarClassName=/);
  assert.equal(html, renderToStaticMarkup(createElement(publicAPI.ScrollArea, props, article)));
});

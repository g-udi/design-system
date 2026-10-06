import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Rating/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Rating/stories/fixtures/rating/rating-display-options.jsx', import.meta.url));

test('Rating publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Rating, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});


test('Rating clamps out-of-range values to a reachable selected star', () => {
  const html = renderToStaticMarkup(createElement(publicAPI.Rating, { rating: 10, maxRating: 5, editable: true }));
  assert.equal((html.match(/tabindex="0"/g) || []).length, 1);
  assert.equal((html.match(/aria-checked="true"/g) || []).length, 1);
  assert.match(renderToStaticMarkup(createElement(publicAPI.Rating, { rating: Number.NaN })), /Rated 0 out of 5/);
});

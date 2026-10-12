import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Slider/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Slider/stories/fixtures/slider/slider-thumbs-states.jsx', import.meta.url));

test('Slider publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Slider, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});


test('Slider supplies one default thumb and places the host label and description on that thumb', () => {
  const html = renderToStaticMarkup(createElement(publicAPI.Slider, { min: 5, 'aria-labelledby': 'volume-label', 'aria-describedby': 'volume-hint' }));
  const thumbs = html.match(/<span[^>]*role="slider"[^>]*>/g) || [];
  assert.equal(thumbs.length, 1);
  assert.match(thumbs[0], /aria-labelledby="volume-label"/);
  assert.match(thumbs[0], /aria-describedby="volume-hint"/);
  assert.doesNotMatch(thumbs[0], /aria-label=/);
  assert.equal((html.match(/aria-labelledby="volume-label"/g) || []).length, 1);
  assert.equal((html.match(/aria-describedby="volume-hint"/g) || []).length, 1);
});

test('Slider names unlabelled thumbs through thumbLabel and takes an explicit dir', () => {
  const fallback = renderToStaticMarkup(createElement(publicAPI.Slider, { defaultValue: [10, 40] }));
  assert.match(fallback, /aria-label="Value 1"/);
  const translated = renderToStaticMarkup(createElement(publicAPI.Slider, { defaultValue: [10, 40], dir: 'rtl', thumbLabel: (index) => `Valeur ${index + 1}` }));
  assert.match(translated, /aria-label="Valeur 2"/);
  assert.match(translated, /dir="rtl"/);
});

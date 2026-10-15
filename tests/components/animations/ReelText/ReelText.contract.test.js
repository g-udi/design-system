import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
test('ReelText labels the whole value once, reels only digits and renders deterministically', async () => {
  const { ReelText } = await loadComponent(new URL('../../../../src/components/animations/ReelText/index.js', import.meta.url));
  const render = props => renderToStaticMarkup(createElement(ReelText, { value: '$1,204', paused: true, 'data-consumer': 'kept', ...props }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="\$1,204"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /data-animated="false"/);
  // Four digit reels (each a 0–9 strip); "$" and "," stay as fixed glyphs.
  assert.equal((html.match(/gaudi-reel-text__reel/g) ?? []).length, 4);
  assert.equal((html.match(/--reel-digit:/g) ?? []).length, 4);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});
test('ReelText escapes text and clamps timing', async () => {
  const { ReelText } = await loadComponent(new URL('../../../../src/components/animations/ReelText/index.js', import.meta.url));
  const html = renderToStaticMarkup(createElement(ReelText, { value: '<9>', duration: 99999, stagger: -5, paused: true }));
  assert.match(html, /aria-label="&lt;9&gt;"/);
  assert.match(html, /--reel-duration:4000ms/);
  assert.match(html, /--reel-stagger:0ms/);
});

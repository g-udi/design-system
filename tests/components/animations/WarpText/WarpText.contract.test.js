import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('WarpText keeps readable fallback text and deterministic SSR without browser globals', async () => {
  const { WarpText } = await loadComponent(new URL('../../../../src/components/animations/WarpText/index.js', import.meta.url));
  const render = () => renderToStaticMarkup(createElement(WarpText, { text: 'Readable <words>\nNext line', paused: true, warpStrength: NaN, pointerRadius: Infinity, 'data-consumer': 'kept' }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /Readable &lt;words&gt;/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-ready="false"/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('GridScan preserves semantic content and deterministic server output', async () => {
  const { GridScan } = await loadComponent(new URL('../../../../src/components/animations/GridScan/index.js', import.meta.url));
  const render = () => renderToStaticMarkup(createElement(GridScan, { paused: true, height: 280, 'data-consumer': 'kept' }, createElement('p', null, 'Readable <content>')));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /Readable &lt;content&gt;/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /data-slot="grid-scan"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity|fragment=/);
});

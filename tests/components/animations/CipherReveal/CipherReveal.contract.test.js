import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
test('CipherReveal preserves readable, escaped content and deterministic server output', async () => {
  const { CipherReveal } = await loadComponent(new URL('../../../../src/components/animations/CipherReveal/index.js', import.meta.url));
  const render = () => renderToStaticMarkup(createElement(CipherReveal, { ...{"text": "Readable <content>"}, paused: true, 'data-consumer': 'kept' }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /Readable &lt;content&gt;/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /data-animated="false"/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

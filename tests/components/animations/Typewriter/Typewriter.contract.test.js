import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
test('Typewriter preserves readable, escaped content and deterministic server output', async () => {
  const { Typewriter } = await loadComponent(new URL('../../../../src/components/animations/Typewriter/index.js', import.meta.url));
  const render = () => renderToStaticMarkup(createElement(Typewriter, { ...{"texts": ["Readable <content>", "Second phrase"]}, paused: true, 'data-consumer': 'kept' }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /Readable &lt;content&gt;/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /data-animated="false"/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

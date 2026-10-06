import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('LightRays keeps its decoration separate from accessible, deterministic content', async () => {
  const module = await loadComponent(new URL('../../../../src/components/animations/LightRays/index.js', import.meta.url));
  assert.equal(module.default, module.LightRays);
  const render = () => renderToStaticMarkup(createElement(module.LightRays, {
    paused: true, height: 240, interactive: true, 'data-consumer': 'kept',
    className: 'consumer-surface', style: { borderRadius: 0 }
  }, createElement('button', { type: 'button' }, 'Readable <content>')));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /data-slot="light-rays"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /consumer-surface/);
  assert.match(html, /height:240px/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.match(html, /<button type="button">Readable &lt;content&gt;<\/button>/);
  assert.doesNotMatch(html, /<div[^>]*aria-hidden="true"|aria-live|NaN|Infinity/);
});

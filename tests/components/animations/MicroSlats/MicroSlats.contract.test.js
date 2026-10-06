import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('MicroSlats server output preserves foreground content and decorative semantics', async () => {
  const module = await loadComponent(new URL('../../../../src/components/animations/MicroSlats/index.js', import.meta.url));
  assert.equal(module.default, module.MicroSlats);
  const render = () => renderToStaticMarkup(createElement(module.MicroSlats, {
    paused: true,
    height: 280,
    'data-consumer': 'kept',
    children: createElement('h2', null, 'Readable <content>')
  }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /data-slot="micro-slats"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.match(html, /<h2>Readable &lt;content&gt;<\/h2>/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

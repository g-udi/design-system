import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('PatternWaves server output preserves foreground content and decorative semantics', async () => {
  const module = await loadComponent(new URL('../../../../src/components/animations/PatternWaves/index.js', import.meta.url));
  assert.equal(module.default, module.PatternWaves);
  const render = () => renderToStaticMarkup(createElement(module.PatternWaves, {
    paused: true,
    height: 280,
    'data-consumer': 'kept',
    children: createElement('h2', null, 'Readable <content>')
  }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /data-slot="pattern-waves"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.match(html, /<h2>Readable &lt;content&gt;<\/h2>/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

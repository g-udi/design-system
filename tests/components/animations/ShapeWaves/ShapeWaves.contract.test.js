import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('ShapeWaves server output preserves foreground content and decorative semantics', async () => {
  const module = await loadComponent(new URL('../../../../src/components/animations/ShapeWaves/index.js', import.meta.url));
  assert.equal(module.default, module.ShapeWaves);
  const render = () => renderToStaticMarkup(createElement(module.ShapeWaves, {
    paused: true,
    height: 280,
    'data-consumer': 'kept',
    children: createElement('h2', null, 'Readable <content>')
  }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /data-slot="shape-waves"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.match(html, /<h2>Readable &lt;content&gt;<\/h2>/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

test('ShapeWaves exposes cutout text once without masking foreground children', async () => {
  const { ShapeWaves } = await loadComponent(new URL('../../../../src/components/animations/ShapeWaves/index.js', import.meta.url));
  const html = renderToStaticMarkup(createElement(ShapeWaves, {
    text: 'A & B <C>',
    children: createElement('button', null, 'Foreground action')
  }));
  assert.match(html, /<canvas[^>]*mask-image:/);
  assert.match(html, /<span class="sr-only">A &amp; B &lt;C&gt;<\/span>/);
  assert.equal((html.match(/A &amp; B &lt;C&gt;/g) || []).length, 1);
  assert.match(html, /<button>Foreground action<\/button>/);
  assert.doesNotMatch(html, /<C>|textSize=|cellSize=|dotSize=|canvasStyle=/);
});

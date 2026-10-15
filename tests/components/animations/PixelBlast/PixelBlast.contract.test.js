import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('PixelBlast keeps its decoration separate from accessible, deterministic content', async () => {
  const module = await loadComponent(new URL('../../../../src/components/animations/PixelBlast/index.js', import.meta.url));
  assert.equal(module.default, module.PixelBlast);
  const render = () => renderToStaticMarkup(createElement(module.PixelBlast, {
    paused: true, height: 240, interactive: true, 'data-consumer': 'kept',
    className: 'consumer-surface', style: { borderRadius: 0 }
  }, createElement('button', { type: 'button' }, 'Readable <content>')));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /data-slot="pixel-blast"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /consumer-surface/);
  assert.match(html, /height:240px/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.match(html, /<button type="button">Readable &lt;content&gt;<\/button>/);
  assert.doesNotMatch(html, /<div[^>]*aria-hidden="true"|aria-live|NaN|Infinity/);
});

test('PixelBlast can drop its fill and fade its canvas with a preset or a custom mask', async () => {
  const { PixelBlast } = await loadComponent(new URL('../../../../src/components/animations/PixelBlast/index.js', import.meta.url));
  const render = (props) => renderToStaticMarkup(createElement(PixelBlast, { paused: true, ...props }));
  const filled = render();
  assert.match(filled, /background:var\(--ds-color-surface\)/);
  assert.doesNotMatch(filled, /data-mask|data-transparent|mask-image/);
  const header = render({ transparent: true, mask: 'text' });
  assert.match(header, /data-mask="text"/);
  assert.match(header, /data-transparent=""/);
  assert.match(header, /background:transparent/);
  assert.equal(render({ mask: 'none' }), filled);
  const custom = render({ mask: 'linear-gradient(to right, transparent, black), linear-gradient(to bottom, black, transparent)' });
  assert.match(custom, /data-mask="custom"/);
  assert.match(custom, /<canvas[^>]*style="mask-image:linear-gradient\(to right, transparent, black\), linear-gradient\(to bottom, black, transparent\);mask-composite:intersect/);
});

test('the named canvas fades are defined in the background stylesheet and follow writing direction', async () => {
  const { readFile } = await import('node:fs/promises');
  const css = await readFile(new URL('../../../../src/components/animations/Backgrounds.css', import.meta.url), 'utf8');
  for (const preset of [ 'bottom', 'edges', 'text' ]) assert.match(css, new RegExp(`\\[data-mask='${preset}'\\] > \\.ds-background__canvas \\{\\s*(?:mask-composite: intersect;\\s*)?mask-image`));
  assert.match(css, /\[data-mask='text'\]:dir\(rtl\)/);
});

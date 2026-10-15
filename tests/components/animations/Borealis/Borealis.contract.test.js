import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { default: Borealis } = await loadComponent(new URL('../../../../src/components/animations/Borealis/index.js', import.meta.url));

for (const variant of ['aurora', 'soft', 'unknown']) {
  test(`Borealis ${variant} preserves direct page content and hides only its decoration`, () => {
    const html = renderToStaticMarkup(createElement(Borealis, { variant, fadeEdges: false, 'aria-label': 'Introduction' }, createElement('h1', null, 'Project overview')));
    assert.match(html, /aria-label="Introduction"/);
    assert.match(html, /aria-hidden="true"[^>]*class="ds-background borealis"/);
    assert.match(html, /data-fade="false"/);
    assert.match(html, new RegExp(`data-variant="${variant === 'soft' ? 'soft' : 'aurora'}"`));
    assert.match(html, /<\/div><h1>Project overview<\/h1><\/div>$/);
    assert.doesNotMatch(html, /NaN|Infinity|fragment=|uniforms=/);
  });
}

test('Borealis fixed-height opt-in leaves its page layout default intact', () => {
  const fixed = renderToStaticMarkup(createElement(Borealis, { height: 500 }));
  assert.match(fixed, /style="height:500px;min-height:0"/);
  const page = renderToStaticMarkup(createElement(Borealis));
  assert.match(page, /min-h-dvh/);
  assert.doesNotMatch(page, /min-height:0/);
});

test('Borealis passes transparent and mask to its decoration, and a mask replaces the edge fade', () => {
  const faded = renderToStaticMarkup(createElement(Borealis, { height: 560 }));
  assert.match(faded, /data-fade="true"/);
  const band = renderToStaticMarkup(createElement(Borealis, { height: 560, transparent: true, mask: 'text' }));
  assert.match(band, /data-fade="false"/);
  assert.match(band, /class="ds-background borealis"[^>]*data-mask="text"[^>]*data-transparent=""[^>]*style="[^"]*background:transparent/);
  const bare = renderToStaticMarkup(createElement(Borealis, { mask: 'none' }));
  assert.match(bare, /data-fade="false"/);
  assert.doesNotMatch(bare, /data-mask/);
});

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

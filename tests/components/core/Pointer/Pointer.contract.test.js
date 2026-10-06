import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { Pointer } = await loadComponent(new URL('../../../../src/components/core/Pointer/index.js', import.meta.url));
test('pointer decoration stays inactive and hidden from assistive technology during server rendering', () => {
  for (const variant of ['dot', 'ring', 'frame', 'label']) {
    const html = renderToStaticMarkup(createElement(Pointer, { variant, label: 'Read' }, createElement('button', null, 'Read article')));
    assert.match(html, /<button>Read article<\/button>/);
    assert.match(html, /aria-hidden="true"/);
    assert.doesNotMatch(html, /data-active=/);
    assert.doesNotMatch(html, /tabindex=/);
    assert.match(html, new RegExp(`data-variant="${variant}"`));
  }
});

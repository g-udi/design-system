import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Tree/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Tree/stories/fixtures/tree/tree-display-options.jsx', import.meta.url));

test('Tree publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Tree, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});


test('Tree leaves are non-submitting buttons without a false expandable state', () => {
  const item = { getProps: () => ({ role: 'treeitem' }), getItemMeta: () => ({ level: 1 }), isFolder: () => false, isExpanded: () => false };
  const html = renderToStaticMarkup(createElement(publicAPI.TreeItem, { item }, 'Leaf'));
  assert.match(html, /type="button"/);
  assert.doesNotMatch(html, /aria-expanded/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Files render as a labelled tree', () => {
  const html = render(api.ChatFileExplorer, { label: 'Files', items: { root: { name: 'Files', children: ['a'] }, a: { name: 'draft.mdx' } } });
  // Rows mount on the client with the tree state; the server renders the labelled tree region.
  assert.match(html, /aria-label="Files"/);
  assert.match(html, /role="tree"/);
});

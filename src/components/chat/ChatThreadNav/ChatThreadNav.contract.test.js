import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('The thread navigator reports its position and disables the ends', () => {
  const html = render(api.ChatThreadNav, { turns: [{ id: 'a', label: 'First' }, { id: 'b', label: 'Second' }], current: 'a' });
  assert.match(html, /1 of 2/);
  assert.match(html, /aria-label="Previous prompt"[^>]*disabled|disabled[^>]*aria-label="Previous prompt"/);
  assert.equal(render(api.ChatThreadNav, { turns: [] }), '');
});

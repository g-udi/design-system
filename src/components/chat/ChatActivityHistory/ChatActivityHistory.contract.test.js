import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Activity is a labelled history of items', () => {
  const html = render(api.ChatActivity, { title: 'Activity', items: [{ id: '1', time: '09:12', title: 'Searched the archive', icon: 'Search' }] });
  assert.match(html, /aria-label="Activity"/);
  assert.match(html, /Searched the archive/);
});

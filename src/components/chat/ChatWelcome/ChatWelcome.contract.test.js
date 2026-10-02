import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Welcome is a heading with starter prompts', () => {
  const html = render(api.ChatWelcome, { title: 'What are we writing today?', suggestions: ['Plan next week'] });
  assert.match(html, /<h2[^>]*>What are we writing today\?<\/h2>/);
  assert.match(html, /Plan next week/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Suggestions are a labelled list of buttons and render nothing when empty', () => {
  const html = render(api.MessageSuggestions, { suggestions: ['Write a subtitle', { id: 'b', label: 'Check links' }] });
  assert.match(html, /aria-label="Suggested prompts"/);
  assert.equal(html.match(/<button/g)?.length, 2);
  assert.equal(render(api.MessageSuggestions, { suggestions: [] }), '');
});

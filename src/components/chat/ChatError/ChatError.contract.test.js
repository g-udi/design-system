import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('A failed turn is an alert with a retry', () => {
  const html = render(api.MessageError, { onRetry: () => {} }, 'The connection dropped.');
  assert.match(html, /role="alert"/);
  assert.match(html, /Try again/);
});

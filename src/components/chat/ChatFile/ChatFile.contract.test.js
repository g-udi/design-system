import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('A delivered file labels its actions with the file name', () => {
  const html = render(api.MessageFile, { name: 'report.csv', size: '18 KB', href: '/report.csv', onPreview: () => {} });
  assert.match(html, /aria-label="Preview report.csv"/);
  assert.match(html, /download="report.csv"/);
});

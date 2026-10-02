import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Citations are numbered buttons named by their source, and the list counts sources', () => {
  const source = { title: 'Reading Lab study', url: 'https://example.com/study' };
  assert.match(render(api.MessageCitation, { index: 1, source }), /aria-label="Source 1: Reading Lab study"/);
  assert.match(render(api.MessageSources, { sources: [source, { title: 'Report' }] }), /2 sources/);
});

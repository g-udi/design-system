import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const publicAPI = await loadComponent(new URL('./index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../.storybook/fixtures/patterns/item/c-item-1.jsx', import.meta.url));

test('Item publishes its composition and supports server rendering', () => {
  for (const name of ['Item', 'ItemMedia', 'ItemContent', 'ItemActions', 'ItemGroup', 'ItemSeparator', 'ItemTitle', 'ItemDescription', 'ItemHeader', 'ItemFooter']) {
    assert.ok(publicAPI[name], `${name} must stay available`);
  }
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.match(html, /data-slot="item"/);
  assert.doesNotMatch(html, /\[object Object\]/);
});

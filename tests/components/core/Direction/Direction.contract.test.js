import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
const { DirectionProvider, useDirection } = await loadComponent(new URL('../../../../src/components/core/Direction/index.js', import.meta.url));
function Consumer() { return createElement('span', null, useDirection()); }
test('DirectionProvider scopes right-to-left text direction', () => {
  assert.equal(renderToStaticMarkup(createElement(DirectionProvider, { dir: 'rtl' }, createElement(Consumer))), '<span>rtl</span>');
});

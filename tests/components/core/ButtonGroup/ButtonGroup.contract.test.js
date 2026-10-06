import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/ButtonGroup/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/ButtonGroup/stories/fixtures/button-group/button-group-toolbars.jsx', import.meta.url));

test('ButtonGroup publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.ButtonGroup, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

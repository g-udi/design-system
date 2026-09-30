import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const publicAPI = await loadComponent(new URL('./index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../.storybook/fixtures/reui/questionnaire/c-questionnaire-1.jsx', import.meta.url));

test('Questionnaire publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Questionnaire, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

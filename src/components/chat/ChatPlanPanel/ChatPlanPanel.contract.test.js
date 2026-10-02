import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('The plan counts finished steps', () => {
  const plan = render(api.ChatPlan, { steps: [{ id: '1', title: 'Read', status: 'done' }, { id: '2', title: 'Write', status: 'running' }] });
  assert.match(plan, /1 of 2 done/);
});

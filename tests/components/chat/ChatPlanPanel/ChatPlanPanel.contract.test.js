import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatPlanPanel/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('The plan counts finished steps', () => {
  const plan = render(api.ChatPlan, { steps: [{ id: '1', title: 'Read', status: 'done' }, { id: '2', title: 'Write', status: 'running' }] });
  assert.match(plan, /1 of 2 done/);
});

test('step notes preserve prepared text and labels inside a named list', () => {
  const plan = render(api.ChatPlan, { labels: { notes: 'Applied guidance' }, steps: [{ id: 'write', title: 'Write', status: 'running', notes: [{ id: 'n1', text: 'Keep <original> wording.\nSecond line.', label: 'Applied now' }] }] });
  assert.match(plan, /role="listitem" aria-current="step"/);
  assert.match(plan, /aria-label="Applied guidance"/);
  assert.match(plan, /Applied now/);
  assert.match(plan, /Keep &lt;original&gt; wording\.\nSecond line\./);
});

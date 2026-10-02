import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

const status = await loadComponent(new URL('../shared/index.js', import.meta.url));

test('Status vocabulary and feedback actions are labelled', () => {
  assert.deepEqual(Object.keys(status.messageStatuses), ['pending', 'running', 'done', 'failed', 'cancelled', 'awaiting', 'denied']);
  const html = render(api.MessageFeedback, { copyText: 'Hi', onRegenerate: () => {} });
  for (const label of ['Copy', 'Good reply', 'Bad reply', 'Regenerate']) assert.match(html, new RegExp(`aria-label="${label}"`));
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /role="status"/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatFeedback/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

const status = await loadComponent(new URL('../../../../src/components/chat/shared/index.js', import.meta.url));

test('Status vocabulary and feedback actions are labelled', () => {
  assert.deepEqual(Object.keys(status.messageStatuses), ['pending', 'running', 'done', 'failed', 'cancelled', 'awaiting', 'denied']);
  const html = render(api.ChatMessageFeedback, { copyText: 'Hi', onRegenerate: () => {} });
  for (const label of ['Copy', 'Good reply', 'Bad reply', 'Regenerate']) assert.match(html, new RegExp(`aria-label="${label}"`));
  assert.match(html, /aria-pressed="false"/);
  // Confirmations are spoken through the shared live region rather than a status per reply.
  assert.doesNotMatch(html, /role="status"/);
  assert.match(readFileSync(new URL('../../../../src/components/chat/ChatFeedback/ChatMessageFeedback.jsx', import.meta.url), 'utf8'), /useLiveAnnouncer\(\)/);
});

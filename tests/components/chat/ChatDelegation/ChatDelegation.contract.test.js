import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatDelegation/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('A delegation names the agent and its status', () => {
  const html = render(api.ChatMessageDelegation, { agent: { name: 'Research agent' }, status: 'running', instructions: 'Find three studies.' });
  assert.match(html, /Handed to/);
  assert.match(html, /Research agent/);
  assert.match(html, /data-status="running"/);
});

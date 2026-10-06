import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatActivityIndicator/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('ChatActivityIndicator is a polite status for each state and settles on an icon', () => {
  assert.deepEqual(api.activityStates, ['idle', 'thinking', 'streaming', 'tool', 'done', 'error']);
  const busy = render(api.ChatActivityIndicator, { state: 'streaming' });
  assert.match(busy, /role="status"/);
  assert.match(busy, /aria-live="polite"/);
  assert.match(busy, /Writing a reply/);
  assert.match(render(api.ChatActivityIndicator, { state: 'error', labels: { error: 'Stopped' } }), /Stopped/);
  assert.match(render(api.ChatActivityIndicator, { state: 'unknown' }), /data-state="idle"/);
});

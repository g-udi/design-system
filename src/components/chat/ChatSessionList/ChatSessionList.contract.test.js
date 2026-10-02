import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Sessions mark the current chat and label each row menu', () => {
  const sessions = render(api.ChatSessionList, { activeId: 'a', onRename: () => {}, onDelete: () => {}, sessions: [{ id: 'a', title: 'First', group: 'Today' }, { id: 'b', title: 'Second' }] });
  assert.match(sessions, /aria-current="page"[^>]*>.*First/s);
  assert.match(sessions, /aria-label="Chat options: Second"/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../.storybook/fixtures/patterns/chat/c-chat-4.jsx', import.meta.url));

test('Chat publishes the shell and its panels and supports server rendering', () => {
  for (const name of ['ChatShell', 'ChatSessionList', 'ChatFileExplorer', 'ChatPlan', 'ChatActivity', 'ChatThreadNav', 'ChatWelcome']) assert.ok(api[name], name);
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.match(html, /data-slot="chat-shell"/);
  assert.match(html, /<h2[^>]*>Launch: Gaudi 2.0<\/h2>/);
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('ChatShell names its regions and opens side columns from labelled buttons', () => {
  const html = renderToStaticMarkup(createElement(api.ChatShell, { title: 'Draft review', navigation: 'Sessions', details: 'Plan', composer: 'Composer' }, 'Thread'));
  assert.match(html, /aria-label="Chats and files"/);
  assert.match(html, /aria-label="Details"/);
  assert.match(html, /aria-label="Open chats"/);
  assert.match(html, /aria-label="Open details"/);
  assert.match(html, /data-slot="chat-thread"/);
  const sidebar = renderToStaticMarkup(createElement(api.ChatShell, { variant: 'sidebar', title: 'Assistant', navigation: 'Sessions' }, 'Thread'));
  assert.doesNotMatch(sidebar, /aria-label="Chats and files"/, 'the sidebar keeps navigation in a Sheet');
});

test('Sessions mark the current chat, plans count finished steps', () => {
  const sessions = renderToStaticMarkup(createElement(api.ChatSessionList, { activeId: 'a', onRename: () => {}, onDelete: () => {}, sessions: [{ id: 'a', title: 'First', group: 'Today' }, { id: 'b', title: 'Second' }] }));
  assert.match(sessions, /aria-current="page"[^>]*>.*First/s);
  assert.match(sessions, /aria-label="Chat options: Second"/);
  const plan = renderToStaticMarkup(createElement(api.ChatPlan, { steps: [{ id: '1', title: 'Read', status: 'done' }, { id: '2', title: 'Write', status: 'running' }] }));
  assert.match(plan, /1 of 2 done/);
});

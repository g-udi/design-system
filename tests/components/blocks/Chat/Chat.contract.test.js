import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/blocks/Chat/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/blocks/Chat/stories/fixtures/chat/chat-agent-activity.jsx', import.meta.url));

test('Chat publishes the shell, composed only from Chat-area parts, and supports server rendering', async () => {
  assert.ok(api.ChatShell, 'ChatShell');
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../../../../src/components/blocks/Chat/ChatShell.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /core\/Message|function Chat(Welcome|ThreadNav|Plan|Activity|SessionList)/, 'the shell has no chat parts of its own');
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

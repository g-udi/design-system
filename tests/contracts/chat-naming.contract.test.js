import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { loadComponent } from '../support/renderComponent.js';

const manifest = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));
const catalogue = JSON.parse(await readFile(new URL('../../src/docs/catalogue/catalogue.json', import.meta.url)));
const chat = await loadComponent(new URL('../../src/components/chat/index.js', import.meta.url));

test('chat owner imports and public components consistently use the Chat prefix', () => {
  const owners = Object.keys(manifest.exports).filter(entry => entry.startsWith('./chat/'));
  assert.ok(owners.length > 0);
  for (const owner of owners) assert.match(owner, /^\.\/chat\/Chat[A-Z]\w*$/);
  const components = Object.keys(chat).filter(name => /^[A-Z]/.test(name));
  assert.ok(components.length > 0);
  for (const name of components) assert.match(name, /^Chat[A-Z]/);
  for (const name of ['ChatMessage', 'ChatMessageContent', 'ChatBubble', 'ChatPromptComposer', 'ChatSpeechInput', 'ChatPersona']) {
    assert.equal(typeof chat[name], 'function', `${name} must be exported`);
  }
  assert.equal(typeof chat.useMessageScroller, 'function');
  assert.equal(typeof chat.parseMessageMarkdown, 'function');
});

test('renamed chat docs retain their existing Storybook links', () => {
  const owners = ['ActivityIndicator', 'AgentMark', 'Bubble', 'Message', 'MessageList', 'Persona', 'Voice'];
  for (const owner of owners) {
    assert.equal(catalogue.entries[`chat-${owner.toLowerCase()}--docs`]?.title, `Chat/Chat${owner}`);
  }
  for (const entry of Object.values(catalogue.entries).filter(entry => entry.title.startsWith('Chat/'))) {
    assert.match(entry.title, /^Chat\/Chat[A-Z]/);
  }
});

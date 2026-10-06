import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/chat/ChatMessage/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/chat/ChatBubble/stories/fixtures/chat-bubble/chat-bubble-support-thread.jsx', import.meta.url));

test('ChatMessage publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.ChatMessage, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

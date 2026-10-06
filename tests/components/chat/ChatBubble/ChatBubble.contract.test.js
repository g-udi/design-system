import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatBubble/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('ChatBubble publishes its variants and keeps reactions beside the bubble', () => {
  const html = render(api.ChatBubble, { variant: 'tinted', align: 'end' }, h(api.ChatBubbleContent, null, 'Shipped'), h(api.ChatBubbleReactions, null, '🎉 2'));
  assert.match(html, /data-slot="bubble"[^>]*data-variant="tinted"|data-variant="tinted"[^>]*data-slot="bubble"/);
  assert.match(html, /data-slot="bubble-reactions"/);
});

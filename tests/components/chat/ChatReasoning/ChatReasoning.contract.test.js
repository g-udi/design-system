import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatReasoning/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Reasoning reads as Thinking while streaming and as its duration afterwards', () => {
  assert.match(render(api.ChatMessageReasoning, { streaming: true }, 'Working it out'), /Thinking/);
  const done = render(api.ChatMessageReasoning, { duration: 6, defaultOpen: false }, h(api.ChatMessageReasoningStep, { status: 'done' }, 'Read the draft'));
  assert.match(done, /Thought for 6s/);
  assert.match(done, /aria-expanded="false"/);
  assert.match(done, /data-slot="message-reasoning"/);
});

test('The streaming label shimmers and detailed steps form a chain of thought', () => {
  const streaming = render(api.ChatMessageReasoning, { streaming: true }, 'Working it out');
  assert.match(streaming, /data-slot="shimmer" data-active=""[^>]*>Thinking…</);
  const chain = render(
    api.ChatMessageReasoning,
    { variant: 'steps', duration: 12 },
    h(api.ChatMessageReasoningStep, { status: 'done', icon: 'Search', label: 'Searched the web', meta: '2 results' },
      h(api.ChatMessageReasoningResults, { results: [{ title: 'Reading Lab', url: 'https://example.com/a' }, { title: 'Report', url: 'https://example.org/b' }] })),
    h(api.ChatMessageReasoningStep, { status: 'running', icon: 'BookOpen', label: 'Reading the sources' }, h(api.ChatMessageReasoningResults, { results: [{ title: 'Reading Lab', url: 'https://example.com/a' }] }), h(api.ChatMessageReasoningImage, { src: '/cover.jpg', alt: 'Cover', caption: 'Current cover' })),
    h(api.ChatMessageReasoningStep, { status: 'pending', label: 'Recommend a headline' })
  );
  assert.match(chain, /data-variant="steps"/);
  assert.match(chain, /data-variant="detailed"/);
  assert.match(chain, /, Done</);
  assert.match(chain, /, In progress</);
  // The running step opens by default; the finished one waits for the reader.
  assert.match(chain, /aria-expanded="false"[^>]*>.*Searched the web/);
  assert.match(chain, /aria-expanded="true"[^>]*>.*Reading the sources/);
  assert.match(chain, /aria-label="Search results"/);
  assert.match(chain, /href="https:\/\/example.com\/a"/);
  assert.match(chain, /<figcaption[^>]*>Current cover<\/figcaption>/);
});

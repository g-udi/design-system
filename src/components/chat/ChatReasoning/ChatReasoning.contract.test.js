import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Reasoning reads as Thinking while streaming and as its duration afterwards', () => {
  assert.match(render(api.MessageReasoning, { streaming: true }, 'Working it out'), /Thinking/);
  const done = render(api.MessageReasoning, { duration: 6, defaultOpen: false }, h(api.MessageReasoningStep, { status: 'done' }, 'Read the draft'));
  assert.match(done, /Thought for 6s/);
  assert.match(done, /aria-expanded="false"/);
  assert.match(done, /data-slot="message-reasoning"/);
});

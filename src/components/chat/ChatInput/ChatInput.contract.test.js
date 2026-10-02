import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
const h = createElement;
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));

test('the composer trigger finds @mentions anywhere and /commands only at the start', () => {
  assert.deepEqual(api.findPromptTrigger('Ask @em', 7), { symbol: '@', query: 'em', start: 4, end: 7 });
  assert.deepEqual(api.findPromptTrigger('/sum', 4), { symbol: '/', query: 'sum', start: 0, end: 4 });
  assert.equal(api.findPromptTrigger('a/b', 3), null);
  assert.equal(api.findPromptTrigger('mail@example', 12), null, 'an @ inside a word is not a mention');
});

test('PromptComposer is a labelled combobox with send, and stop plus queue while streaming', () => {
  const ready = renderToStaticMarkup(createElement(api.PromptComposer, { onSubmit: () => {}, onAttach: () => {} }));
  assert.match(ready, /role="combobox"/);
  assert.match(ready, /aria-label="Message"/);
  assert.match(ready, /aria-autocomplete="list"/);
  assert.match(ready, /aria-label="Attach files"/);
  assert.match(ready, /disabled=""[^>]*aria-label="Send"/);
  const streaming = renderToStaticMarkup(createElement(api.PromptComposer, { status: 'streaming', onStop: () => {}, defaultValue: 'Next' }));
  assert.match(streaming, /aria-label="Stop reply"/);
  assert.match(streaming, /aria-label="Add to queue"/);
  assert.match(streaming, /data-status="streaming"/);
});

test('PromptQueue labels each action with the message it acts on', () => {
  const html = renderToStaticMarkup(createElement(api.PromptQueue, { items: [{ id: 'a', text: 'Shorten it' }], onEdit: () => {}, onRemove: () => {}, onSendNow: () => {}, onMove: () => {} }));
  assert.match(html, /Queued · 1/);
  assert.match(html, /aria-label="Edit: Shorten it"/);
  assert.match(html, /aria-label="Remove: Shorten it"/);
  assert.match(html, /aria-label="Send now: Shorten it"/);
  assert.match(html, /aria-keyshortcuts="Alt\+ArrowUp Alt\+ArrowDown"/);
});

test('ChatModelSelect names the current model on its trigger', () => {
  const html = render(api.ChatModelSelect, { models: [{ value: 'fast', label: 'Fast' }, { value: 'deep', label: 'Deep' }], defaultValue: 'deep' });
  assert.match(html, /aria-label="Model: Deep"/);
  assert.match(html, /aria-haspopup="menu"/);
});

test('ChatModelSelect shows a model mark on the trigger, and can drop the default sparkle', () => {
  const Mark = (props) => h('svg', { ...props, 'data-mark': 'atlas' });
  const marked = render(api.ChatModelSelect, { models: [{ value: 'a', label: 'Atlas', icon: Mark }], variant: 'outline', size: 'sm' });
  assert.match(marked, /data-mark="atlas"/);
  assert.match(marked, /aria-hidden="true"[^>]*data-mark|data-mark[^>]*aria-hidden="true"/);
  assert.equal(render(api.ChatModelSelect, { models: [{ value: 'a', label: 'Atlas' }] }).match(/<svg/g)?.length, 2);
  assert.equal(render(api.ChatModelSelect, { models: [{ value: 'a', label: 'Atlas' }], icon: false }).match(/<svg/g)?.length, 1);
});

test('PromptComposer places extra actions beside send', () => {
  const html = render(api.PromptComposer, { onSubmit: () => {}, actions: h('button', { type: 'button', 'aria-label': 'Use voice input' }) });
  assert.match(html, /aria-label="Use voice input"[^]*aria-label="Send"/);
});

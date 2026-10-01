import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
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

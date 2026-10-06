import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
const h = createElement;
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatInput/index.js', import.meta.url));

test('ChatPromptToggle keeps its name and selected state independent of its visual label reveal', () => {
  const selected = render(api.ChatPromptToggle, { icon: 'Globe', label: 'Search', defaultPressed: true });
  assert.match(selected, /aria-label="Search"/);
  assert.match(selected, /aria-pressed="true"/);
  assert.match(selected, /data-slot="prompt-toggle-label" aria-hidden="true"/);
  const controlled = render(api.ChatPromptToggle, { icon: 'Brain', label: 'Think', defaultPressed: true, pressed: false, disabled: true });
  assert.match(controlled, /aria-pressed="false"/);
  assert.match(controlled, /disabled=""/);
  assert.match(controlled, /aria-label="Think"/);
});

test('the composer trigger finds @mentions anywhere and /commands only at the start', () => {
  assert.deepEqual(api.findPromptTrigger('Ask @em', 7), { symbol: '@', query: 'em', start: 4, end: 7 });
  assert.deepEqual(api.findPromptTrigger('/sum', 4), { symbol: '/', query: 'sum', start: 0, end: 4 });
  assert.equal(api.findPromptTrigger('a/b', 3), null);
  assert.equal(api.findPromptTrigger('mail@example', 12), null, 'an @ inside a word is not a mention');
});

test('ChatPromptComposer is a labelled combobox with send, and stop plus queue while streaming', () => {
  const ready = renderToStaticMarkup(createElement(api.ChatPromptComposer, { onSubmit: () => {}, onAttach: () => {} }));
  assert.match(ready, /role="combobox"/);
  assert.match(ready, /aria-label="Message"/);
  assert.match(ready, /aria-autocomplete="list"/);
  assert.match(ready, /aria-label="Attach files"/);
  assert.match(ready, /disabled=""[^>]*aria-label="Send"/);
  const streaming = renderToStaticMarkup(createElement(api.ChatPromptComposer, { status: 'streaming', onStop: () => {}, defaultValue: 'Next' }));
  assert.match(streaming, /aria-label="Stop reply"/);
  assert.match(streaming, /aria-label="Add to queue"/);
  assert.match(streaming, /data-status="streaming"/);
});

test('ChatPromptQueue labels each action with the message it acts on', () => {
  const html = renderToStaticMarkup(createElement(api.ChatPromptQueue, { items: [{ id: 'a', text: 'Shorten it' }], onEdit: () => {}, onRemove: () => {}, onSendNow: () => {}, onMove: () => {} }));
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

test('ChatModelSelect disables its trigger in both menu and searchable presentations', () => {
  for (const searchable of [false, true]) {
    const html = render(api.ChatModelSelect, { models: [{ value: 'atlas', label: 'Atlas' }], searchable, disabled: true });
    assert.match(html, /<button[^>]*disabled=""/);
  }
});

test('ChatPromptComposer places extra actions beside send', () => {
  const html = render(api.ChatPromptComposer, { onSubmit: () => {}, actions: h('button', { type: 'button', 'aria-label': 'Use voice input' }) });
  assert.match(html, /aria-label="Use voice input"[^]*aria-label="Send"/);
});

test('explicit composer control slots replace their legacy aliases, including null', () => {
  const props = {
    toolbar: h('button', { type: 'button' }, 'Legacy toolbar'),
    actions: h('button', { type: 'button' }, 'Legacy actions'),
    leftControls: h('button', { type: 'button' }, 'Choose model'),
    rightControls: h('button', { type: 'button' }, 'Context usage')
  };
  const html = render(api.ChatPromptComposer, props);
  assert.doesNotMatch(html, /Legacy toolbar|Legacy actions/);
  assert.match(html, /data-side="left"[^]*Choose model[^]*data-side="right"[^]*Context usage[^]*aria-label="Send"/);
  const cleared = render(api.ChatPromptComposer, { ...props, leftControls: null, rightControls: null });
  assert.doesNotMatch(cleared, /Legacy toolbar|Legacy actions|Choose model|Context usage/);
  assert.match(cleared, /aria-label="Send"/);
});

test('the public composer API contains presentation helpers, not provider catalogues or billing policy', () => {
  for (const name of ['chatModels', 'chatModelProviders', 'estimateChatCost']) assert.equal(name in api, false);
  assert.equal(api.formatTokenCount(85_700), '85.7K');
  assert.equal(api.formatTokenCount(1_000_000), '1M');
});

test('ChatModelSelect groups by provider and can switch to a searchable list', () => {
  const models = [{ value: 'atlas', label: 'Atlas Pro', provider: 'private' }, { value: 'quick', label: 'Atlas Quick', provider: 'private' }];
  assert.match(render(api.ChatModelSelect, { models }), /aria-haspopup="menu"/);
  const searchable = render(api.ChatModelSelect, { models, searchable: true });
  assert.match(searchable, /aria-haspopup="dialog"/);
  assert.match(searchable, /aria-label="Model: Atlas Pro"/);
});

test('ChatModelSelect uses a dialog for a footer control without requiring search', () => {
  const html = render(api.ChatModelSelect, { models: [{ value: 'atlas', label: 'Atlas Pro' }] }, h('button', { type: 'button' }, 'Compare models'));
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-label="Model: Atlas Pro"/);
  assert.doesNotMatch(html, /aria-haspopup="menu"/);
});

test('ChatContextMeter presents explicit totals and host status without inferring a policy', () => {
  const calm = render(api.ChatContextMeter, { usedTokens: 40_000, maxTokens: 100_000 });
  assert.match(calm, /aria-label="Context: 40% used, 40K of 100K tokens"/);
  assert.match(calm, /data-tone="accent"/);
  assert.match(render(api.ChatContextMeter, { usedTokens: 95_000, maxTokens: 100_000 }), /data-tone="accent"/);
  assert.match(render(api.ChatContextMeter, { usedTokens: 10, maxTokens: 100, tone: 'warning' }), /data-tone="warning"/);
  const formatted = render(api.ChatContextMeter, { usedTokens: 0, maxTokens: 100, formatTokens: (value) => `${value},00`, formatPercentage: () => 'zero percent' });
  assert.match(formatted, /Context: zero percent used, 0,00 of 100,00 tokens/);
});

test('ChatPromptComposer card variant swaps voice into the send slot until there is text', () => {
  const voice = h('button', { type: 'button', 'aria-label': 'Dictate' });
  const empty = render(api.ChatPromptComposer, { variant: 'card', voice, onSubmit: () => {} });
  assert.match(empty, /data-variant="card"/);
  assert.match(empty, /aria-label="Dictate"/);
  assert.doesNotMatch(empty, /aria-label="Send"/);
  const typed = render(api.ChatPromptComposer, { variant: 'card', voice: () => voice, defaultValue: 'Hi', onSubmit: () => {} });
  assert.doesNotMatch(typed, /aria-label="Dictate"/);
  assert.match(typed, /aria-label="Send"/);
});

test('ChatPromptAttachMenu and ChatPromptSettings are named toolbar buttons', () => {
  const attach = render(api.ChatPromptAttachMenu, { onAttach: () => {} });
  assert.match(attach, /aria-label="Add attachments"/);
  assert.match(attach, /aria-haspopup="menu"/);
  const settings = render(api.ChatPromptSettings, { options: [{ value: 'web', label: 'Web search' }], defaultValues: { web: true } });
  assert.match(settings, /aria-label="Options, Web search on"/);
  assert.match(settings, /data-active="true"/);
});

test('ChatPromptComposer shares attachment thumbnails and audio/video type icons', () => {
  const html = render(api.ChatPromptComposer, { attachments: [
    { id: 'cover', name: 'cover.png', type: 'image/png', previewUrl: '/static/images/art/0.svg' },
    { id: 'audio', name: 'podcast.mp3', type: 'audio/mpeg' },
    { id: 'video', name: 'demo.mp4', type: 'video/mp4' }
  ], onRemoveAttachment: () => {} });
  assert.match(html, /<img[^>]*src="\/static\/images\/art\/0.svg"/);
  assert.match(html, /lucide-music/);
  assert.match(html, /lucide-video/);
  assert.match(html, /aria-label="Remove podcast.mp3"/);
});

test('a read-only composer keeps its draft and disables sending and attachment changes', () => {
  const html = render(api.ChatPromptComposer, {
    defaultValue: 'Prepared draft',
    textareaProps: { readOnly: true },
    attachments: [{ id: 0, name: 'brief.pdf' }],
    onAttach: () => {}, onRemoveAttachment: () => {}
  });
  assert.match(html, /readonly=""/i);
  assert.match(html, /Prepared draft/);
  for (const label of ['Send', 'Attach files', 'Remove brief.pdf']) {
    const button = html.match(new RegExp(`<button[^>]*aria-label="${label}"[^>]*>`))?.[0];
    assert.ok(button?.includes('disabled=""'), `${label} is disabled`);
  }
});

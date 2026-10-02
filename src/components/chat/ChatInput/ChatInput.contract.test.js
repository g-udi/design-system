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

test('chatModels ships Claude and OpenAI models with context, capabilities and pricing', () => {
  const providers = new Set(api.chatModels.map((model) => model.provider));
  assert.ok(providers.has('anthropic') && providers.has('openai'));
  assert.ok(api.chatModels.some((model) => model.label === 'Claude Haiku 4.5'));
  assert.ok(api.chatModels.some((model) => model.value === 'gpt-4o'));
  for (const model of api.chatModels) {
    assert.ok(model.value && model.label && model.icon, `${model.value} has a name and mark`);
    assert.ok(model.contextWindow > 0 && model.pricing?.input >= 0, `${model.value} has a window and pricing`);
    assert.ok(api.chatModelProviders[model.provider], `${model.value} names a known provider`);
  }
});

test('formatTokenCount and estimateChatCost read usage the way the meter shows it', () => {
  assert.equal(api.formatTokenCount(85_700), '85.7K');
  assert.equal(api.formatTokenCount(1_000_000), '1M');
  const cost = api.estimateChatCost({ inputTokens: 1_000_000, cachedInputTokens: 500_000, outputTokens: 100_000, reasoningTokens: 100_000 }, { input: 2, output: 10, cachedInput: 0.2 });
  assert.deepEqual(cost, { input: 1, cachedInput: 0.1, output: 1, reasoning: 1, total: 3.1 });
  assert.equal(api.estimateChatCost({ inputTokens: 10 }), null);
});

test('ChatModelSelect groups by provider and can switch to a searchable list', () => {
  const models = api.chatModels.slice(0, 2);
  assert.match(render(api.ChatModelSelect, { models }), /aria-haspopup="menu"/);
  const searchable = render(api.ChatModelSelect, { models, searchable: true });
  assert.match(searchable, /aria-haspopup="dialog"/);
  assert.match(searchable, /aria-label="Model: Claude Opus 5"/);
});

test('ChatContextMeter names the share of the window used and turns tone near the limit', () => {
  const model = { label: 'Small', contextWindow: 100_000 };
  const calm = render(api.ChatContextMeter, { model, usage: { inputTokens: 30_000, outputTokens: 10_000 } });
  assert.match(calm, /aria-label="Context: 40% used, 40K of 100K tokens"/);
  assert.match(calm, /data-tone="accent"/);
  assert.match(render(api.ChatContextMeter, { model, usedTokens: 80_000 }), /data-tone="warning"/);
  assert.match(render(api.ChatContextMeter, { model, usedTokens: 95_000 }), /data-tone="danger"/);
});

test('PromptComposer card variant swaps voice into the send slot until there is text', () => {
  const voice = h('button', { type: 'button', 'aria-label': 'Dictate' });
  const empty = render(api.PromptComposer, { variant: 'card', voice, onSubmit: () => {} });
  assert.match(empty, /data-variant="card"/);
  assert.match(empty, /aria-label="Dictate"/);
  assert.doesNotMatch(empty, /aria-label="Send"/);
  const typed = render(api.PromptComposer, { variant: 'card', voice: () => voice, defaultValue: 'Hi', onSubmit: () => {} });
  assert.doesNotMatch(typed, /aria-label="Dictate"/);
  assert.match(typed, /aria-label="Send"/);
});

test('PromptAttachMenu and PromptSettings are named toolbar buttons', () => {
  const attach = render(api.PromptAttachMenu, { onAttach: () => {} });
  assert.match(attach, /aria-label="Add attachments"/);
  assert.match(attach, /aria-haspopup="menu"/);
  const settings = render(api.PromptSettings, { options: [{ value: 'web', label: 'Web search' }], defaultValues: { web: true } });
  assert.match(settings, /aria-label="Options, Web search on"/);
  assert.match(settings, /data-active="true"/);
});

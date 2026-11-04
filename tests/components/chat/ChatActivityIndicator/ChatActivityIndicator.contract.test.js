import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatActivityIndicator/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('ChatActivityIndicator is a polite status for each state and settles on an icon', () => {
  assert.deepEqual(api.activityStates, ['idle', 'thinking', 'streaming', 'tool', 'done', 'error']);
  const busy = render(api.ChatActivityIndicator, { state: 'streaming' });
  assert.match(busy, /role="status"/);
  assert.match(busy, /aria-live="polite"/);
  assert.match(busy, /Writing a reply/);
  assert.match(render(api.ChatActivityIndicator, { state: 'error', labels: { error: 'Stopped' } }), /Stopped/);
  assert.match(render(api.ChatActivityIndicator, { state: 'unknown' }), /data-state="idle"/);
});

test('compact activity reuses a decorative ray loader and announces only the current label', () => {
  const busy = render(api.ChatActivityIndicator, { variant: 'compact', state: 'tool', labels: { tool: 'Reading sources' } });
  assert.equal((busy.match(/role="status"/g) || []).length, 1);
  assert.equal((busy.match(/Reading sources/g) || []).length, 1);
  assert.match(busy, /aria-atomic="true"/);
  assert.match(busy, /data-variant="rays"/);
  assert.doesNotMatch(busy, /aria-label="Loading"/);
  assert.match(busy, /data-slot="shimmer" data-active=""/);
  const done = render(api.ChatActivityIndicator, { variant: 'compact', state: 'done' });
  assert.doesNotMatch(done, /data-slot="loader"|data-active=""/);
  const decorative = render(api.ChatActivityIndicator, { variant: 'compact', state: 'thinking', decorative: true });
  assert.doesNotMatch(decorative, /role="status"|aria-live=/);
});

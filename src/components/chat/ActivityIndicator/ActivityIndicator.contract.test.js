import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('ActivityIndicator is a polite status for each state and settles on an icon', () => {
  assert.deepEqual(api.activityStates, ['idle', 'thinking', 'streaming', 'tool', 'done', 'error']);
  const busy = render(api.ActivityIndicator, { state: 'streaming' });
  assert.match(busy, /role="status"/);
  assert.match(busy, /aria-live="polite"/);
  assert.match(busy, /Writing a reply/);
  assert.match(render(api.ActivityIndicator, { state: 'error', labels: { error: 'Stopped' } }), /Stopped/);
  assert.match(render(api.ActivityIndicator, { state: 'unknown' }), /data-state="idle"/);
});

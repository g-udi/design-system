import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Bubble publishes its variants and keeps reactions beside the bubble', () => {
  const html = render(api.Bubble, { variant: 'tinted', align: 'end' }, h(api.BubbleContent, null, 'Shipped'), h(api.BubbleReactions, null, '🎉 2'));
  assert.match(html, /data-slot="bubble"[^>]*data-variant="tinted"|data-variant="tinted"[^>]*data-slot="bubble"/);
  assert.match(html, /data-slot="bubble-reactions"/);
});

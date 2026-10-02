import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('AgentMark is a named image unless decorative, and carries a state badge', () => {
  const html = render(api.AgentMark, { name: 'Gaudi', state: 'thinking' });
  assert.match(html, /role="img"[^>]*aria-label="Gaudi"|aria-label="Gaudi"[^>]*role="img"/);
  assert.match(html, /data-slot="activity-indicator"[^>]*data-state="thinking"|data-state="thinking"[^>]*data-slot="activity-indicator"/);
  const quiet = render(api.AgentMark, { name: 'Research agent', monogram: true, decorative: true });
  assert.match(quiet, /aria-hidden="true"/);
  assert.match(quiet, />RA</);
});

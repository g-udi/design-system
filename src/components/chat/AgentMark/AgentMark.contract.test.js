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

test('AgentMark draws a stable Gaudí motif from its seed, and pins motif or hue on request', () => {
  const first = api.resolveAgentMark('research-agent');
  assert.deepEqual(api.resolveAgentMark('research-agent'), first);
  assert.ok(Object.keys(api.agentMotifs).includes(first.motif));
  assert.ok(api.agentHues.includes(first.hue));
  const seen = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'].map((seed) => api.resolveAgentMark(`agent-${seed}`).motif));
  assert.ok(seen.size >= 4, 'seeds spread across motifs');
  const html = render(api.AgentMark, { name: 'Gaudi', motif: 'catenary', hue: 'teal' });
  assert.match(html, /data-agent-motif="catenary"/);
  assert.match(html, /data-agent-hue="teal"/);
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  const icon = render(api.AgentMark, { name: 'Search agent', icon: 'Search' });
  assert.doesNotMatch(icon, /data-agent-motif/);
});

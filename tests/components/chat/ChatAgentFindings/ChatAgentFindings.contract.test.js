import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { ChatAgentFindings } = await loadComponent(new URL('../../../../src/components/chat/ChatAgentFindings/index.js', import.meta.url));
const render = props => renderToStaticMarkup(h(ChatAgentFindings, props));

test('prepared severities and unknown agent IDs render without inferring domain values', () => {
  const html = render({ title: 'Review <draft>', summary: 0, findings: [{ id: 'a', agent: 'unassigned', severity: 'custom', title: '<script>Unsafe</script>' }], severities: [{ id: 'custom', label: 'Needs attention', tone: 'warning-light' }] });
  assert.match(html, /Review &lt;draft&gt;/);
  assert.match(html, /Needs attention/);
  assert.match(html, /unassigned/);
  assert.doesNotMatch(html, /<script>|Mark reviewed/);
});
test('empty content is supplied independently of execution or review actions', () => {
  const html = render({ findings: [], emptyState: h('p', null, 'Waiting for an external report') });
  assert.match(html, /Waiting for an external report/);
  assert.doesNotMatch(html, /Start demo|Retry agent|Next update/);
});

test('optional agent progress requires both prepared values and preserves zero', () => {
  for (const progress of [{}, { value: 0 }, { max: 10 }, { value: 0, max: 0 }]) {
    const html = render({ agents: [{ id: 'reviewer', name: 'Reviewer', statusLabel: 'Done', ...progress }] });
    assert.doesNotMatch(html, /role="progressbar"|<bdi>\/<\/bdi>/);
  }
  for (const value of [0, 4]) {
    const html = render({ agents: [{ id: 'reviewer', name: 'Reviewer', value, max: 10 }] });
    assert.match(html, /role="progressbar"/);
    assert.match(html, new RegExp(`aria-valuenow="${value}"`));
    assert.match(html, new RegExp(`<bdi>${value}/10</bdi>`));
  }
});

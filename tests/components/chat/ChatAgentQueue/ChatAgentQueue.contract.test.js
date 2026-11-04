import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { ChatAgentQueue } = await loadComponent(new URL('../../../../src/components/chat/ChatAgentQueue/index.js', import.meta.url));
const render = props => renderToStaticMarkup(h(ChatAgentQueue, props));

test('prepared order, zero values and arbitrary job types remain authoritative', () => {
  const html = render({ waiting: [{ id: 'z', name: 'Last alphabetically', kind: 'Custom type', meta: 'External status' }, { id: 'a', name: 'First alphabetically' }], summary: [{ id: 'empty', label: 'Remaining', value: 0 }], workers: [{ id: 0, name: 'Zero worker', statusLabel: 'Standby' }] });
  assert.ok(html.indexOf('Last alphabetically') < html.indexOf('First alphabetically'));
  assert.match(html, /External status/);
  assert.match(html, /Zero worker/);
  assert.match(html, /<bdi>0<\/bdi>/);
  assert.doesNotMatch(html, /Add demo|Next update|Pause queue/);
});
test('all recent results are preserved; the host chooses any history limit', () => {
  const html = render({ recent: Array.from({ length: 9 }, (_, id) => ({ id, name: `Result ${id}`, kind: 'Prepared' })) });
  assert.equal((html.match(/aria-label="Inspect Result /g) || []).length, 9);
  assert.doesNotMatch(html, /Latest six|data-recharts/);
});

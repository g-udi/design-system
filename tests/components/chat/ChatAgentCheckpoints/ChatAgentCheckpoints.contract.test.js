import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { ChatAgentCheckpoints } = await loadComponent(new URL('../../../../src/components/chat/ChatAgentCheckpoints/index.js', import.meta.url));
const render = props => renderToStaticMarkup(h(ChatAgentCheckpoints, props));

const attempts = [{ id: 0, label: 'Attempt zero', checkpoints: [{ id: 0, title: 'Origin', statusLabel: 'Saved' }, { id: 'next', title: 'Next', statusLabel: 'Running', running: true, restoreDisabled: true }] }];
test('zero IDs remain current and action availability is supplied independently', () => {
  const html = render({ attempts, currentAttemptId: 0, currentId: 0, activeIds: [0], onRestore() {} });
  assert.match(html, /aria-current="step"/);
  assert.match(html, /aria-label="Rewind to Origin"/);
  assert.match(html, /disabled=""[^>]*aria-label="Rewind to Next"/);
  assert.doesNotMatch(html, /Switch here/);
});
test('read-only disables supplied mutation actions without hiding history', () => {
  const html = render({ attempts, readOnly: true, onRestore() {}, onSelectAttempt() {} });
  assert.match(html, /Origin/);
  assert.match(html, /disabled=""[^>]*aria-label="Rewind to Origin"/);
  assert.match(html, /disabled=""[^>]*aria-label="Switch to attempt zero"/);
});

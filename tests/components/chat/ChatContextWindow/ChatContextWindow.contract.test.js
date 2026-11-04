import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { ChatContextWindow } = await loadComponent(new URL('../../../../src/components/chat/ChatContextWindow/index.js', import.meta.url));
const render = props => renderToStaticMarkup(h(ChatContextWindow, props));

test('zero capacity avoids NaN and keeps exact supplied totals', () => {
  const html = render({ usedTokens: 0, maxTokens: 0, parts: [{ id: 'custom', label: 'Custom context', tokens: 0 }], formatTokens: n => `${n} units` });
  assert.match(html, /0 units/);
  assert.match(html, /0.0% used/);
  assert.doesNotMatch(html, /NaN|Infinity/);
  assert.equal((html.match(/data-part="available"/g) || []).length, 100);
});
test('file categories accept arbitrary IDs and hide removal when no callback exists', () => {
  const props = { usedTokens: 4, maxTokens: 10, parts: [{ id: 'uploads', label: 'Uploads', tokens: 4, files: [{ id: 0, name: '<draft>.md', tokens: 4 }] }] };
  const html = render(props);
  assert.match(html, /&lt;draft&gt;.md/);
  assert.doesNotMatch(html, /aria-label="Remove /);
  const disabled = render({ ...props, disabled: true, onRemoveFile() {} });
  assert.match(disabled, /disabled=""[^>]*aria-label="Remove &lt;draft&gt;.md"/);
  assert.doesNotMatch(disabled, /Compact conversation|New demo chat/);
});

test('uncolored categories retain their identity, occupied cells and supplied file actions', () => {
  const html = render({
    usedTokens: 50, maxTokens: 100,
    parts: [
      { id: 0, label: 'Instructions', tokens: 40 },
      { id: 'files', label: 'Files', tokens: 10, files: [], actions: h('button', null, 'Attach file') }
    ]
  });
  assert.equal((html.match(/data-part="0"/g) || []).length, 40);
  assert.equal((html.match(/data-part="available"/g) || []).length, 50);
  assert.match(html, /data-part="0"[^>]*background-color:var\(--ds-color-chart-1\)/);
  assert.match(html, /<button>Attach file<\/button>/);
});

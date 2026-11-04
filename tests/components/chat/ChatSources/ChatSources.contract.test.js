import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatSources/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Citations are numbered buttons named by their source, and the list counts sources', () => {
  const source = { title: 'Reading Lab study', url: 'https://example.com/study' };
  assert.match(render(api.ChatMessageCitation, { index: 1, source }), /aria-label="Source 1: Reading Lab study"/);
  assert.match(render(api.ChatMessageSources, { sources: [source, { title: 'Report' }] }), /2 sources/);
});

test('A citation can group several sources behind one pill', () => {
  const sources = [{ title: 'Reading Lab study' }, { title: 'Report' }, { title: 'Survey' }];
  const html = render(api.ChatMessageCitation, { index: 2, sources });
  assert.match(html, /aria-label="Source 2: Reading Lab study, and 2 more"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, />\+2</);
  assert.equal(render(api.ChatMessageCitation, { index: 1, sources: [] }), '');
});

test('Linked answer resolves stable source IDs, ignores unknown citations and escapes prepared text', () => {
  const sources = [{ id: 'first', title: 'Original' }, { id: 'second', title: 'Evidence <draft>' }];
  const segments = [{ id: 'claim', text: '<script>Evidence</script>', sourceIds: ['second', 'missing', 'second'] }];
  const html = render(api.ChatCitedAnswer, { segments, sources });
  assert.match(html, /&lt;script&gt;Evidence&lt;\/script&gt;/);
  assert.match(html, /Source 2: Evidence &lt;draft&gt;/);
  assert.doesNotMatch(html, /Source 3:|missing|<script>/);
  assert.equal((html.match(/aria-expanded="false"/g) || []).length, 1);
  assert.equal((html.match(/aria-checked="false"/g) || []).length, 2);
  const reordered = render(api.ChatCitedAnswer, { segments, sources: sources.toReversed() });
  assert.match(reordered, /Source 1: Evidence &lt;draft&gt;/);
});

test('Linked answer respects controlled disclosure and explicitly supplied quote highlights', () => {
  const sources = [{ id: 'note', title: 'Note', quote: 'Preserve <original> wording.', highlights: ['<original>'] }];
  const segments = [{ id: 'claim', text: 'Preserve the wording.', sourceIds: ['note'] }];
  const html = render(api.ChatCitedAnswer, { segments, sources, defaultOpenSourceId: 'note' });
  assert.match(html, /role="region" aria-label="Source passage"/);
  assert.match(html, /bg-accent-muted[^>]*>&lt;original&gt;<\/span>/);
  assert.doesNotMatch(html, /href=/);
  const closed = render(api.ChatCitedAnswer, { segments, sources, defaultOpenSourceId: 'note', openSourceId: null });
  assert.doesNotMatch(closed, /<blockquote/);
  const empty = render(api.ChatCitedAnswer, { segments });
  assert.match(empty, /Preserve the wording/);
  assert.doesNotMatch(empty, /role="group"|role="status"|aria-expanded/);
});

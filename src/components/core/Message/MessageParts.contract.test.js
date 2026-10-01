import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));

test('MessageMarkdown parses headings, lists, quotes, tables and inline marks at runtime', () => {
  const blocks = api.parseMessageMarkdown('## Plan\n\n1. First\n2. Second\n\n> A quote\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\nPlain **bold** text.');
  assert.deepEqual(blocks.map((block) => block.type), ['heading', 'list', 'quote', 'table', 'paragraph']);
  assert.equal(blocks[1].ordered, true);
  assert.deepEqual(blocks[3].rows, [['1', '2']]);
  const html = renderToStaticMarkup(createElement(api.MessageMarkdown, null, 'Use `syncDraft` and **ship** it, see [docs](https://example.com).'));
  assert.match(html, /<code[^>]*>syncDraft<\/code>/);
  assert.match(html, /<strong[^>]*>ship<\/strong>/);
  assert.match(html, /href="https:\/\/example.com"/);
  // Reply headings start below the conversation heading.
  assert.match(renderToStaticMarkup(createElement(api.MessageMarkdown, null, '## Title')), /<h4/);
});

test('MessageParts renders every part type, gathers sources and cites them by number', () => {
  const parts = [
    { type: 'reasoning', text: 'Thinking about it.' },
    { type: 'text', text: 'Readers stay longer [1].' },
    { type: 'tool', name: 'search_posts', status: 'failed', error: 'Timed out.' },
    { type: 'delegation', agent: { name: 'Research agent' }, status: 'running' },
    { type: 'file', name: 'report.pdf', size: '4 KB' },
    { type: 'data', label: 'Totals', value: { opens: 10 } },
    { type: 'source', title: 'Reading Lab study', url: 'https://example.com/study' },
    { type: 'unknown-host-part', value: 1 }
  ];
  const html = renderToStaticMarkup(createElement(api.MessageParts, { parts, streaming: true }));
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /data-slot="message-reasoning"/);
  assert.match(html, /aria-label="Source 1: Reading Lab study"/);
  assert.match(html, /data-slot="message-tool"[^>]*data-status="failed"/);
  assert.match(html, /role="alert"/, 'a failed tool opens with its error');
  assert.match(html, /Handed to/);
  assert.match(html, /report\.pdf/);
  assert.match(html, /1 source/);
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('Status vocabulary and feedback actions are labelled', () => {
  assert.deepEqual(Object.keys(api.messageStatuses), ['pending', 'running', 'done', 'failed', 'cancelled']);
  const html = renderToStaticMarkup(createElement(api.MessageFeedback, { copyText: 'Hi', onRegenerate: () => {} }));
  for (const label of ['Copy', 'Good reply', 'Bad reply', 'Regenerate']) assert.match(html, new RegExp(`aria-label="${label}"`));
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /role="status"/);
});

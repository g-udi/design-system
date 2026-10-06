import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatMessageList/index.js', import.meta.url));

test('ChatMessageMarkdown parses headings, lists, quotes, tables and inline marks at runtime', () => {
  const blocks = api.parseMessageMarkdown('## Plan\n\n1. First\n2. Second\n\n> A quote\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\nPlain **bold** text.');
  assert.deepEqual(blocks.map((block) => block.type), ['heading', 'list', 'quote', 'table', 'paragraph']);
  assert.equal(blocks[1].ordered, true);
  assert.deepEqual(blocks[3].rows, [['1', '2']]);
  const html = renderToStaticMarkup(createElement(api.ChatMessageMarkdown, null, 'Use `syncDraft` and **ship** it, see [docs](https://example.com).'));
  assert.match(html, /<code[^>]*>syncDraft<\/code>/);
  assert.match(html, /<strong[^>]*>ship<\/strong>/);
  assert.match(html, /href="https:\/\/example.com"/);
  // Reply headings start below the conversation heading.
  assert.match(renderToStaticMarkup(createElement(api.ChatMessageMarkdown, null, '## Title')), /<h4/);
});

test('ChatMessageParts renders every part type, gathers sources and cites them by number', () => {
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
  const html = renderToStaticMarkup(createElement(api.ChatMessageParts, { parts, streaming: true }));
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

test('ChatMessageParts renders chain-of-thought steps, approvals and grouped citations', () => {
  const parts = [
    { type: 'reasoning', steps: [{ status: 'done', label: 'Searched the web', icon: 'Search', results: [{ title: 'Study', url: 'https://example.com/a' }] }] },
    { type: 'approval', name: 'publish_post', input: { slug: 'drafts' } },
    { type: 'text', text: 'Both agree [1, 2].' },
    { type: 'source', title: 'Study', url: 'https://example.com/a' },
    { type: 'source', title: 'Report', url: 'https://example.com/b' }
  ];
  const html = renderToStaticMarkup(createElement(api.ChatMessageParts, { parts, onToolApproval: () => {} }));
  assert.match(html, /data-variant="steps"/);
  assert.match(html, /data-slot="message-tool-approval"/);
  assert.match(html, /aria-label="Source 1: Study, and 1 more"/);
});

test('A checkpoint is a labelled divider with a restore action', () => {
  const html = renderToStaticMarkup(createElement(api.ChatMessageCheckpoint, { label: 'Before the rewrite', time: '10:42', onRestore: () => {} }));
  assert.match(html, /data-slot="message-checkpoint"/);
  assert.match(html, /role="group"/);
  assert.match(html, /data-slot="separator"/);
  assert.match(html, /Before the rewrite/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /Restore checkpoint/);
  const restored = renderToStaticMarkup(createElement(api.ChatMessageCheckpoint, { label: 'Before the rewrite', restored: true, onRestore: () => {} }));
  assert.match(restored, /disabled=""/);
  assert.match(restored, />Restored</);
  assert.doesNotMatch(renderToStaticMarkup(createElement(api.ChatMessageCheckpoint, { label: 'Start' })), /<button/);
});

test('file and error parts reuse the shared Attachment and Alert contracts', () => {
  const html = renderToStaticMarkup(createElement(api.ChatMessageParts, {
    parts: [{ type: 'file', name: 'report.csv', href: '/report.csv' }, { type: 'error', title: 'Reply stopped', text: 'Try once more.' }],
    onRetry: () => {},
    onFileAction: () => {}
  }));
  assert.match(html, /data-slot="attachment"/);
  assert.match(html, /aria-label="Preview report.csv"/);
  assert.match(html, /download="report.csv"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /Try again/);
});

test('file parts pass MIME metadata and explicit previews to shared AttachmentMedia', () => {
  const renderFile = (file) => renderToStaticMarkup(createElement(api.ChatMessageParts, { parts: [{ ...file, type: 'file' }] }));
  assert.match(renderFile({ name: 'recording', mediaType: 'audio/mpeg' }), /lucide-music/);
  assert.match(renderFile({ name: 'recording', fileType: 'video/mp4' }), /lucide-video/);
  assert.match(renderFile({ name: 'cover.png' }), /lucide-image/);
  assert.match(renderFile({ name: 'API Documentation', kind: 'link' }), /lucide-globe/);
  const preview = renderFile({ name: 'cover.svg', mediaType: 'image/svg+xml', previewUrl: '/static/images/art/0.svg' });
  assert.match(preview, /data-slot="attachment-media"[^>]*data-variant="image"/);
  assert.match(preview, /<img[^>]*src="\/static\/images\/art\/0.svg"[^>]*alt=""/);
  assert.match(preview, /data-slot="attachment-title"[^>]*>cover\.svg/);
});

test('suggestion parts render labelled buttons and omit empty lists', () => {
  const html = renderToStaticMarkup(createElement(api.ChatMessageParts, {
    parts: [{ type: 'suggestions', items: ['Write a subtitle', { id: 'links', label: 'Check links', prompt: 'Check the draft links.' }] }]
  }));
  assert.match(html, /aria-label="Suggested prompts"/);
  assert.equal(html.match(/<button/g)?.length, 2);
  const empty = renderToStaticMarkup(createElement(api.ChatMessageParts, { parts: [{ type: 'suggestions', items: [] }] }));
  assert.doesNotMatch(empty, /data-slot="message-suggestions"/);
  assert.equal(api.ChatMessageSuggestions, undefined, 'the renderer is private to ChatMessageParts');
});


test('markdown tables reuse shared table parts inside a named keyboard-scroll region', () => {
  const html = renderToStaticMarkup(createElement(api.ChatMessageMarkdown, null, '| MixedCase heading | Count |\n| --- | --- |\n| Ready | 0 |'));
  const container = html.match(/<div[^>]*data-slot="table-container"[^>]*>/)?.[0];
  assert.match(container, /role="region"/);
  assert.match(container, /aria-label="Table"/);
  assert.match(container, /tabindex="0"/);
  assert.match(html, /<table[^>]*data-slot="table"[^>]*data-density="normal"/);
  assert.match(html, /<th[^>]*data-slot="table-head"[^>]*scope="col"[^>]*>MixedCase heading<\/th>/);
  assert.match(html, /<td[^>]*data-slot="table-cell"[^>]*>0<\/td>/);
});

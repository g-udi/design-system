import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { prepareFileTree } from '../../../../src/components/chat/ChatFileExplorer/chatFileExplorerModel.js';
import { normalizeDownloadHref } from '../../../../src/utilities/href.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatFileExplorer/index.js', import.meta.url));
const render = (props) => renderToStaticMarkup(h(api.ChatFileExplorer, props));
const files = {
  root: { name: 'Files', children: ['shared', 'agent'] },
  shared: { name: 'Shared', children: ['brief'] },
  brief: { name: 'brief.md', typeLabel: 'Markdown', sizeLabel: '4 KB', modifiedLabel: 'Edited yesterday' },
  agent: { name: 'Researcher', children: ['notes'] },
  notes: { name: 'notes', children: ['report', 'data'] },
  report: { name: 'survey-report.md', meta: 'Reviewed' },
  data: { name: 'responses.csv', typeLabel: 'CSV' }
};

test('Files retain the labelled region and Core Tree server contract', () => {
  const html = render({ label: 'Workspace files', items: files });
  assert.match(html, /aria-label="Workspace files"/);
  assert.match(html, /role="tree"/);
  assert.match(html, /aria-multiselectable="false"/);
  assert.match(html, /aria-label="Search files"/);
});

test('file search preserves only matches and their ancestor folders', () => {
  const result = prepareFileTree(files, 'root', 'survey-report');
  assert.deepEqual(result.items.root.children, ['agent']);
  assert.deepEqual(result.items.agent.children, ['notes']);
  assert.deepEqual(result.items.notes.children, ['report']);
  assert.equal(result.total, 3);
  assert.equal(result.matches, 1);
  assert.deepEqual(new Set(result.expanded), new Set(['agent', 'notes']));
  assert.equal(files.root.children.length, 2, 'filtering must not mutate the host map');
});

test('folder matches reveal descendants and prepared metadata is searchable', () => {
  const folder = prepareFileTree(files, 'root', 'researcher');
  assert.equal(folder.matches, 2);
  assert.deepEqual(folder.items.notes.children, ['report', 'data']);
  assert.equal(prepareFileTree(files, 'root', 'reviewed').items.report.name, 'survey-report.md');
  assert.equal(prepareFileTree(files, 'root', 'markdown').items.brief.name, 'brief.md');
  assert.equal(prepareFileTree(files, 'root', '4 KB').items.brief.name, 'brief.md');
  assert.equal(prepareFileTree(files, 'root', 'yesterday').items.brief.name, 'brief.md');
  assert.equal(prepareFileTree(files, 'root', 'unknown').matches, 0);
});

test('missing children, duplicates, cycles, and absent roots do not poison the tree', () => {
  const result = prepareFileTree({ ...files, root: { name: 'Files', children: ['shared', 'missing', 'shared'] }, shared: { name: 'Shared', children: ['root', 'brief'] } });
  assert.deepEqual(result.items.root.children, ['shared']);
  assert.deepEqual(result.items.shared.children, ['brief']);
  assert.equal(result.total, 1);
  assert.equal(prepareFileTree(undefined).total, 0);
});

test('downloads accept real file destinations and reject script/contact/fragment links', () => {
  for (const value of ['/files/report.csv', 'https://example.test/report.csv', 'blob:https://example.test/report']) assert.equal(normalizeDownloadHref(value), value);
  for (const value of ['javascript:alert(1)', 'data:text/html,<script>', '#file', 'mailto:me@example.test', '', null]) assert.equal(normalizeDownloadHref(value), null);
});

test('empty, loading and error states compose shared recovery primitives', () => {
  assert.match(render({}), /No files yet/);
  const loading = render({ loading: true });
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /data-slot="skeleton"/);
  assert.doesNotMatch(loading, /No files yet/);
  const error = render({ error: 'Connection lost', onRetry: () => {} });
  assert.match(error, /role="alert"/);
  assert.match(error, /Connection lost/);
  assert.match(error, /Try again/);
  assert.doesNotMatch(error, /No files yet/);
});


test('empty folders remain tree entries and search results without increasing the file count', () => {
  const items = { root: { name: 'Files', children: ['drafts'] }, drafts: { name: 'Drafts', children: [] } };
  for (const query of ['', 'drafts']) {
    const model = prepareFileTree(items, 'root', query);
    assert.equal(model.total, 0);
    assert.equal(model.matches, 0);
    assert.equal(model.hasItems, true);
    assert.deepEqual(model.items.root.children, ['drafts']);
  }
  const unmatched = prepareFileTree(items, 'root', 'missing');
  assert.equal(unmatched.hasItems, true);
  assert.deepEqual(unmatched.items.root.children, []);
  const html = render({ items });
  assert.match(html, /role="tree"/);
  assert.match(html, /aria-label="Search files"/);
  assert.doesNotMatch(html, /aria-label="0 files"/);
  assert.match(html, />0<span class="sr-only"> files<\/span>/);
  assert.doesNotMatch(html, /No files yet/);
});

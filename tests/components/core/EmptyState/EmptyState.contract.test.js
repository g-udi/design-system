import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('EmptyState preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/EmptyState/EmptyState.jsx', import.meta.url),
    { title: 'No articles', description: 'Start a draft.', role: 'status' }
  );
  assert.match(html, /role="status"/);
  assert.match(html, /No articles/);
  assert.match(html, /Start a draft./);
});

test('EmptyState keeps a div title by default and renders a heading through titleAs', async () => {
  const url = new URL('../../../../src/components/core/EmptyState/EmptyState.jsx', import.meta.url);
  assert.match(await renderComponent(url, { title: 'No articles' }), /<div data-slot="empty-title"[^>]*>No articles<\/div>/);
  assert.match(await renderComponent(url, { title: 'No articles', titleAs: 'h2' }), /<h2 data-slot="empty-title"[^>]*>No articles<\/h2>/);
});

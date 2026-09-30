import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('EmptyState preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./EmptyState.jsx', import.meta.url),
    { title: 'No articles', description: 'Start a draft.', role: 'status' }
  );
  assert.match(html, /role="status"/);
  assert.match(html, /No articles/);
  assert.match(html, /Start a draft./);
});

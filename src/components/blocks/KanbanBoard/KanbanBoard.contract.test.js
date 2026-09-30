import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('KanbanBoard preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./KanbanBoard.jsx', import.meta.url),
    {
      label: 'Editorial workflow',
      columns: [{ id: 'draft', label: 'Drafts' }],
      items: [{ id: 'a', title: 'Notes', columnId: 'draft' }]
    }
  );
  assert.match(html, /aria-label="Editorial workflow"/);
  assert.match(html, /aria-label="Drafts"/);
  assert.match(html, /Notes/);
});

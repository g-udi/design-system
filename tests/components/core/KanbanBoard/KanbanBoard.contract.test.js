import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

test('KanbanBoard preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/KanbanBoard/KanbanBoard.jsx', import.meta.url),
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

test('KanbanBoard column limits show a work-in-progress count that warns when exceeded', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/KanbanBoard/KanbanBoard.jsx', import.meta.url), {
    columns: [{ id: 'review', label: 'Review', limit: 1 }, { id: 'done', label: 'Done' }],
    items: [{ id: 'a', title: 'One', columnId: 'review' }, { id: 'b', title: 'Two', columnId: 'review' }]
  });
  assert.match(html, /data-over-limit="true"/);
  assert.match(html, />2\/1</);
  assert.match(html, /2 of 1 cards, over the limit/);
});

test('Kanban composition parts: counts, rails, scrolling board and separate drag handles', async () => {
  const parts = await loadComponent(new URL('../../../../src/components/core/KanbanBoard/Kanban.jsx', import.meta.url));
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');

  const within = renderToStaticMarkup(h(parts.KanbanColumnCount, { count: 2, limit: 3 }));
  assert.doesNotMatch(within, /data-over-limit/);
  assert.match(within, /2 of 3 cards/);
  assert.match(renderToStaticMarkup(h(parts.KanbanColumnCount, { count: 1 })), /1 card</);

  const rail = renderToStaticMarkup(h(parts.KanbanColumnRail, { label: 'Paused', count: 2 }));
  assert.match(rail, /<button[^>]*type="button"/);
  assert.match(rail, /aria-expanded="false"/);
  assert.match(rail, /aria-label="Expand Paused, 2 cards"/);

  const value = { todo: [{ id: 'a' }], done: [] };
  const board = renderToStaticMarkup(
    h(parts.Kanban, { value, onValueChange: () => {}, getItemValue: (item) => item.id },
      h(parts.KanbanBoard, { layout: 'scroll', 'aria-label': 'Board' },
        h(parts.KanbanColumn, { value: 'todo' },
          h(parts.KanbanColumnContent, { value: 'todo' },
            h(parts.KanbanItem, { value: 'a', withHandle: true }, h(parts.KanbanItemHandle, { asChild: true }, h('button', { type: 'button' }, 'Move'))))),
        h(parts.KanbanColumn, { value: 'done', collapsed: true }, h(parts.KanbanColumnRail, { label: 'Done', count: 0 }))))
  );
  assert.match(board, /data-slot="kanban-board"[^>]*data-layout="scroll"|data-layout="scroll"[^>]*data-slot="kanban-board"/);
  assert.match(board, /role="region"/);
  assert.match(board, /data-collapsed="true"/);
  // With withHandle the card itself is not a button; its handle carries the sortable role.
  assert.doesNotMatch(board, /data-slot="kanban-item"[^>]*role="button"/);
  assert.match(board, /data-slot="kanban-item-handle"[^>]*role="button"|role="button"[^>]*data-slot="kanban-item-handle"/);
});

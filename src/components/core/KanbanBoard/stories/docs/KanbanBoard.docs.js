import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Kanban": {
    ...definition('Move work items between columns while retaining an accessible move action.', [p('columns', 'Array<{ id, label, limit? }>', '[]', 'Board columns with stable IDs; limit adds a work-in-progress count that warns when exceeded.'), p('items', 'Array<{ id, columnId }>', '[]', 'Host-owned work items.'), p('renderItem', '(item) => ReactNode', '—', 'Item card content.'), p('onMove', '(itemId, columnId) => void', '—', 'Request a move; the application updates items.'), p('label / moveLabel / emptyLabel', 'string', 'Board / Move / No items', 'Accessible board and action labels.'), p('disabled', 'boolean', 'false', 'Disable moving items.')], 'Every item has a move control so dragging is optional. Keep columns inside the contained horizontal scrolling region (layout="scroll" on the composition board). Collapsed rails are buttons that name the column and its count; cards with their own controls use withHandle so the drag grip, not the card, is the sortable control.'),
    usage: "import KanbanBoard from '@gaudi/design-system/core/KanbanBoard';\n\n<KanbanBoard columns={columns} items={tasks} onMove={moveTask} />"
  }
};

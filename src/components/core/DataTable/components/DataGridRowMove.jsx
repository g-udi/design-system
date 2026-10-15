'use client';
/* Row menu items that move a row among its siblings: up, down, to the top and
 to the bottom. They report through the DataGrid's `onRowMove` with the same
 `{ id, parentId, index, targetId, position }` shape drag and drop uses, so
 one handler serves the menu, the keyboard and the pointer. */
import { useDataGrid } from '../DataGrid.jsx';
import {
  useDataGridStructureLabels
} from './DataGridTreeRows.jsx';
import {
  DropdownMenuItem,
  DropdownMenuShortcut
} from '../../DropdownMenu/DropdownMenuPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getDataGridRowSiblings, getDataGridSiblingMove } from '../dataGridStructureModel.js';

/**
 * Move up, Move down, Move to top and Move to bottom for one row, for a row
 * actions `DropdownMenuContent`. Items at an edge are disabled, and all of
 * them are while the grid is sorted, because the sort decides the order then.
 * Pass `steps={false}` to keep only the top and bottom moves.
 */
export function DataGridTableRowMoveItems({ row, onRowMove, steps = true, shortcuts = true }) {
  const { props, table } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const report = onRowMove ?? props.onRowMove;
  const siblings = getDataGridRowSiblings(row);
  const at = siblings.findIndex((sibling) => sibling.id === row.id);
  const sorted = (table.state.sorting?.length ?? 0) > 0;
  const unavailable = sorted || !report;
  const move = (index) => report?.(getDataGridSiblingMove(row, index));
  const items = [
    steps && { key: 'up', label: labels.moveUp, icon: 'ArrowUp', index: at - 1, shortcut: 'Alt+↑', disabled: at <= 0 },
    steps && { key: 'down', label: labels.moveDown, icon: 'ArrowDown', index: at + 1, shortcut: 'Alt+↓', disabled: at >= siblings.length - 1 },
    { key: 'top', label: labels.moveToTop, icon: 'ArrowUpToLine', index: 0, shortcut: 'Alt+Home', disabled: at <= 0 },
    { key: 'bottom', label: labels.moveToBottom, icon: 'ArrowDownToLine', index: siblings.length - 1, shortcut: 'Alt+End', disabled: at >= siblings.length - 1 }
  ].filter(Boolean);
  return items.map((item) => (
    <DropdownMenuItem
      key={item.key}
      disabled={unavailable || item.disabled}
      title={sorted ? labels.reorderingWhileSorted : undefined}
      onSelect={() => move(item.index)}
    >
      <RegistryIcon lucide={item.icon} aria-hidden='true' />
      {item.label}
      {shortcuts ? <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut> : null}
    </DropdownMenuItem>
  ));
}

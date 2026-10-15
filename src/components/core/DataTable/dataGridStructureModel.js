/* Server-safe tree, section and row-move helpers for the DataGrid structure
 parts. Client modules import them; public entries re-export them from here. */
import { flexRender } from '@tanstack/react-table';

/* A short, human name for a row in announcements and status rows: the
 host's `getRowLabel`, else the first visible column's string value. */
export function getDataGridRowLabel(row, getRowLabel) {
  if (!row) return '';
  if (getRowLabel) return String(getRowLabel(row) ?? row.id);
  for (const cell of row.getVisibleCells()) {
    const value = cell.getValue();
    if (typeof value === 'string' && value) return value;
  }
  return String(row.id);
}
/* The rows a tree rollup aggregates: the deepest loaded rows under `rows`.
 A branch whose children have not loaded counts as one leaf with its own
 value, so a server-provided folder total still rolls up. */
export function getDataGridRollupRows(rows) {
  const frontier = [];
  const visit = (list) => {
    for (const row of list) {
      if (row.subRows?.length) visit(row.subRows);
      else frontier.push(row);
    }
  };
  visit(rows);
  return frontier;
}
function resolveColumn(table, column) {
  return typeof column === 'string' ? table.getColumn(column) : column;
}
/** A row's rollup: the column's `aggregationFn` over every loaded descendant. */
export function getDataGridRollupValue(row, column) {
  const resolved = resolveColumn(row.table, column);
  if (!resolved || !row.subRows?.length) return row.getValue(resolved?.id ?? column);
  return resolved.getAggregationValue({ rows: getDataGridRollupRows(row.subRows), maxDepth: 0 });
}
/** The grand total of a tree column: every filtered leaf, at any depth, once. */
export function getDataGridTreeTotal(table, column) {
  const resolved = resolveColumn(table, column);
  if (!resolved) return undefined;
  const rows = table.getPreGroupedRowModel?.().rows ?? table.getCoreRowModel().rows;
  return resolved.getAggregationValue({ rows: getDataGridRollupRows(rows), maxDepth: 0 });
}
export const formatDataGridRollup = (value) =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : value instanceof Date
      ? value.toLocaleDateString()
      : Array.isArray(value)
        ? value.map(formatDataGridRollup).join(' – ')
        : value ?? '';
/* Renders a rollup value with the column's `meta.rollupCell`, or formatted. */
export function renderDataGridRollup({ column, row, table, value, scope }) {
  const rollupCell = column.columnDef.meta?.rollupCell;
  if (rollupCell) return flexRender(rollupCell, { column, row, table, value, scope });
  return <span className='tabular-nums'>{formatDataGridRollup(value)}</span>;
}
/* Whether a body cell shows a rollup instead of the row's own value: tree
 parents (not grouping bands) in columns with `meta.rollup`. */
export function getDataGridCellIsRollup(cell) {
  return (
    !!cell.column.columnDef.meta?.rollup &&
    cell.row.subRows?.length > 0 &&
    !cell.row.getIsGrouped?.()
  );
}
export function renderDataGridRollupCell(cell) {
  return (
    <span data-slot='data-grid-rollup' className='font-medium'>
      {renderDataGridRollup({
        column: cell.column,
        row: cell.row,
        table: cell.row.table,
        value: getDataGridRollupValue(cell.row, cell.column),
        scope: 'row'
      })}
    </span>
  );
}
/* --- Moving rows --------------------------------------------------------- */

/* The siblings a row can be moved among, in display order. */
export function getDataGridRowSiblings(row) {
  const parent = row.getParentRow?.();
  if (parent) return parent.subRows;
  const rows = row.table.getRowModel().rows.filter((candidate) => candidate.depth === row.depth);
  return rows.length ? rows : [row];
}
/* A move report for placing `row` at `index` among its own siblings. */
export function getDataGridSiblingMove(row, index) {
  const siblings = getDataGridRowSiblings(row);
  const others = siblings.filter((sibling) => sibling.id !== row.id);
  const clamped = Math.max(0, Math.min(index, others.length));
  const target = others[clamped] ?? others[others.length - 1];
  return {
    id: row.id,
    parentId: row.getParentRow?.()?.id ?? null,
    index: clamped,
    targetId: target?.id ?? null,
    position: others[clamped] ? 'before' : 'after'
  };
}
/**
 * Applies a move reported by `onRowMove` — `{ id, parentId, index, targetId,
 * position }` — and returns new data. Pass `childrenKey` for nested data: the
 * row leaves its old parent and lands at `index` among `parentId`'s children
 * (`null` for the top level). Without it the data is a flat list and the row
 * is placed before or after `targetId` (or at `index` when there is none), so
 * the same report works for flat, grouped and sectioned grids.
 */
export function moveDataGridRow(data, move, { getRowId = (row) => row.id, childrenKey } = {}) {
  if (!move || move.id == null) return data;
  const sameId = (row) => String(getRowId(row)) === String(move.id);
  if (!childrenKey) {
    const item = data.find(sameId);
    if (!item) return data;
    const rest = data.filter((row) => !sameId(row));
    let index = Math.max(0, Math.min(move.index ?? rest.length, rest.length));
    if (move.targetId != null && move.position !== 'inside') {
      const targetIndex = rest.findIndex((row) => String(getRowId(row)) === String(move.targetId));
      if (targetIndex !== -1) index = move.position === 'after' ? targetIndex + 1 : targetIndex;
    }
    rest.splice(index, 0, item);
    return rest;
  }
  let moved;
  const remove = (rows) => {
    let changed = false;
    const next = [];
    for (const row of rows) {
      if (sameId(row)) {
        moved = row;
        changed = true;
        continue;
      }
      const children = row[childrenKey];
      if (Array.isArray(children)) {
        const nextChildren = remove(children);
        if (nextChildren !== children) {
          changed = true;
          next.push({ ...row, [childrenKey]: nextChildren });
          continue;
        }
      }
      next.push(row);
    }
    return changed ? next : rows;
  };
  const without = remove(data);
  if (!moved) return data;
  const insertAt = (rows) => {
    const next = rows.slice();
    next.splice(Math.max(0, Math.min(move.index ?? next.length, next.length)), 0, moved);
    return next;
  };
  if (move.parentId == null) return insertAt(without);
  let placed = false;
  const insert = (rows) =>
    rows.map((row) => {
      if (placed) return row;
      if (String(getRowId(row)) === String(move.parentId)) {
        placed = true;
        return { ...row, [childrenKey]: insertAt(row[childrenKey] ?? []) };
      }
      const children = row[childrenKey];
      if (!Array.isArray(children)) return row;
      const nextChildren = insert(children);
      return nextChildren === children ? row : { ...row, [childrenKey]: nextChildren };
    });
  const result = insert(without);
  return placed ? result : data;
}

/* --- Cascading selection -------------------------------------------------- */

export const canSelectDataGridRow = (row) => row.getCanSelect?.() !== false;
/**
 * A tree row's checkbox state, derived from its descendants: `true` when every
 * selectable descendant is selected, `'indeterminate'` when some are, and the
 * row's own selection for leaves (including lazy parents not loaded yet).
 */
export function getDataGridTreeSelectionState(row, selection = row.table.atoms.rowSelection?.get() ?? {}) {
  const children = row.subRows?.filter(canSelectDataGridRow) ?? [];
  if (!children.length) return !!selection[row.id];
  let all = true;
  let some = false;
  for (const child of children) {
    const state = getDataGridTreeSelectionState(child, selection);
    if (state === true) some = true;
    else if (state === 'indeterminate') {
      some = true;
      all = false;
    } else all = false;
    if (some && !all) break;
  }
  return all ? true : some ? 'indeterminate' : false;
}
/* Selects or clears a row with all of its descendants, then settles every
 ancestor: a parent is selected exactly when all of its children are. */
export function applyDataGridTreeSelection(next, row, value) {
  const visit = (current) => {
    if (canSelectDataGridRow(current)) {
      if (value) next[current.id] = true;
      else delete next[current.id];
    }
    current.subRows?.forEach(visit);
  };
  visit(row);
  let parent = row.getParentRow?.();
  while (parent) {
    const children = parent.subRows.filter(canSelectDataGridRow);
    if (canSelectDataGridRow(parent)) {
      if (children.length && children.every((child) => next[child.id])) next[parent.id] = true;
      else delete next[parent.id];
    }
    parent = parent.getParentRow?.();
  }
}
export function toggleDataGridTreeRowSelected(row, value) {
  row.table.setRowSelection((old) => {
    const next = { ...old };
    applyDataGridTreeSelection(next, row, value ?? getDataGridTreeSelectionState(row) !== true);
    return next;
  });
}

/* Literal class strings so Tailwind sees every tone. */
// Dark subtle tones are deep, so the wash halves there to stay a tint.
export const dataGridSectionToneClasses = {
  neutral: { band: 'bg-ui-muted/40', mark: 'bg-ui-muted-foreground/60' },
  accent: { band: 'bg-accent-subtle dark:bg-accent-subtle/50', mark: 'bg-accent' },
  info: { band: 'bg-info-subtle dark:bg-info-subtle/50', mark: 'bg-info' },
  success: { band: 'bg-success-subtle dark:bg-success-subtle/50', mark: 'bg-success' },
  warning: { band: 'bg-warning-subtle dark:bg-warning-subtle/50', mark: 'bg-warning' },
  danger: { band: 'bg-danger-subtle dark:bg-danger-subtle/50', mark: 'bg-danger' },
  attention: { band: 'bg-attention-subtle dark:bg-attention-subtle/50', mark: 'bg-attention' },
  discovery: { band: 'bg-discovery-subtle dark:bg-discovery-subtle/50', mark: 'bg-discovery' }
};
export const dataGridSectionTones = Object.keys(dataGridSectionToneClasses);

/* Alt+Arrow and Alt+Home/End on a row's drag handle: the keyboard twin of the
 move items. Returns true when the key was handled. */
export function handleDataGridRowMoveKey(event, row, report) {
  if (!report || !event.altKey || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return false;
  const siblings = getDataGridRowSiblings(row);
  const at = siblings.findIndex((sibling) => sibling.id === row.id);
  const index =
    event.key === 'Home' ? 0 : event.key === 'End' ? siblings.length - 1 : at + (event.key === 'ArrowUp' ? -1 : 1);
  event.preventDefault();
  if (index < 0 || index >= siblings.length || index === at) return true;
  report(getDataGridSiblingMove(row, index));
  return { index, count: siblings.length };
}

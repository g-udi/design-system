'use client';
/* Tree structure for the DataGrid: children that load on demand, rollups that
 aggregate through every level of a tree, and one move helper that applies a
 reported row move to flat or nested data.

 This file deliberately imports nothing from DataGridTable.jsx: the
 table renders the lazy status row and rollup cells from here, so the
 dependency only runs one way. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import { flexRender } from '@tanstack/react-table';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Skeleton } from '../../Skeleton/SkeletonPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/* Copy for the structural parts. Hosts override any of these through the
 grid's `i18n.labels`, exactly like the built-in labels. */
const DATA_GRID_STRUCTURE_LABELS = {
  loadingChildren: (label) => `Loading ${label}`,
  childrenLoadFailed: (label) => `Couldn't load ${label}`,
  retry: 'Retry',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  expandLevels: 'Expand',
  expandToLevel: 'Expand to level',
  level: (level) => `Level ${level}`,
  dragToMoveRow: 'Drag to move row, or press Enter to move with the keyboard',
  movingRow: (label) => `Moving ${label}. Use the arrow keys to choose a place, Enter to drop, Escape to cancel.`,
  dropBefore: (label) => `Before ${label}`,
  dropAfter: (label) => `After ${label}`,
  dropInside: (label) => `Into ${label}`,
  movedRow: (label, target) => `Moved ${label}. ${target}.`,
  moveCancelled: (label) => `Move of ${label} cancelled.`,
  moveUp: 'Move up',
  moveDown: 'Move down',
  moveToTop: 'Move to top',
  moveToBottom: 'Move to bottom',
  movedToPosition: (label, position, count) => `${label} moved to position ${position} of ${count}.`,
  reorderingWhileSorted: 'Clear the sort to reorder rows',
  selectSection: (label) => `Select all in ${label}`,
  expandSection: (label) => `Expand ${label}`,
  collapseSection: (label) => `Collapse ${label}`,
  addToSection: (label) => `Add to ${label}`,
  sectionCount: (count) => `${count} ${count === 1 ? 'row' : 'rows'}`,
  sectionEmpty: (label) => `Nothing in ${label} yet.`
};
export function useDataGridStructureLabels() {
  const { i18n } = useDataGrid();
  return useMemo(
    () => ({ ...DATA_GRID_STRUCTURE_LABELS, ...i18n.labels }),
    [i18n.labels]
  );
}

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

function isExpandedIn(expanded, id) {
  return expanded === true || !!expanded?.[id];
}
function omitKey(record, key) {
  if (!(key in record)) return record;
  const next = { ...record };
  delete next[key];
  return next;
}

/**
 * Loads a tree's children on demand. A row is lazy when `getRowHasChildren`
 * says it has children that `getSubRows` does not return yet; expanding it
 * calls `loadChildren(row)` once, shows a loading row while the promise is
 * pending and an error row with Retry when it rejects. Results are cached, so
 * collapsing and expanding again does not refetch; `invalidate(id)` drops one.
 *
 * Spread `tableOptions` into `useTable` and pass the hook's return value to
 * `<DataGrid lazyRows={lazy}>` so the table renders the status rows.
 * `onChildrenLoad(id, children, row)` lets a host merge loaded children into
 * its own data (needed when rows can move); host children always win over the
 * cache.
 */
export function useDataGridLazyRows({
  data,
  expanded,
  getRowId = (row) => row.id,
  getSubRows = (row) => row.children,
  getRowHasChildren = (row) => !!row.hasChildren,
  loadChildren,
  onChildrenLoad
}) {
  const [cache, setCache] = useState(() => new Map());
  const [status, setStatus] = useState({});
  const requests = useRef(new Map());
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const latest = useRef(null);
  latest.current = { getRowId, getSubRows, getRowHasChildren, loadChildren, onChildrenLoad };
  const childrenOf = useCallback(
    (original) => {
      const own = latest.current.getSubRows(original);
      if (own !== undefined && own !== null) return own;
      return cache.get(latest.current.getRowId(original));
    },
    [cache]
  );
  const load = useCallback((original) => {
    const { getRowId: rowId, loadChildren: loader } = latest.current;
    const id = rowId(original);
    const token = {};
    requests.current.set(id, token);
    setStatus((old) => ({ ...old, [id]: { state: 'loading' } }));
    Promise.resolve()
      .then(() => loader(original))
      .then(
        (children) => {
          if (!mounted.current || requests.current.get(id) !== token) return;
          requests.current.delete(id);
          const list = Array.isArray(children) ? children : [];
          setCache((old) => new Map(old).set(id, list));
          setStatus((old) => omitKey(old, id));
          latest.current.onChildrenLoad?.(id, list, original);
        },
        (error) => {
          if (!mounted.current || requests.current.get(id) !== token) return;
          requests.current.delete(id);
          setStatus((old) => ({ ...old, [id]: { state: 'error', error } }));
        }
      );
  }, []);
  // Every expanded lazy row that has neither children, a pending request nor
  // an error gets loaded. Expanding everything (`expanded === true`) walks
  // down level by level as each batch arrives.
  useEffect(() => {
    const { getRowId: rowId, getRowHasChildren: hasChildren } = latest.current;
    const visit = (rows) => {
      for (const original of rows ?? []) {
        const id = rowId(original);
        if (!isExpandedIn(expanded, id)) continue;
        const children = childrenOf(original);
        if (children === undefined) {
          if (hasChildren(original) && !status[id] && !requests.current.has(id)) load(original);
          continue;
        }
        visit(children);
      }
    };
    visit(data);
  }, [data, expanded, childrenOf, status, load]);
  const retry = useCallback((id) => {
    requests.current.delete(id);
    setStatus((old) => omitKey(old, id));
  }, []);
  const invalidate = useCallback((id) => {
    requests.current.delete(id);
    setCache((old) => {
      if (!old.has(id)) return old;
      const next = new Map(old);
      next.delete(id);
      return next;
    });
    setStatus((old) => omitKey(old, id));
  }, []);
  // The core row model is memoised on `data` alone, so a fresh array is what
  // makes newly cached children appear: `cache` is the intended trigger.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableData = useMemo(() => (data ? data.slice() : []), [data, cache]);
  const tableOptions = useMemo(
    () => ({
      data: tableData,
      getRowId: (original, index, parent) => latest.current.getRowId(original, index, parent),
      getSubRows: (original) => childrenOf(original),
      getRowCanExpand: (row) =>
        row.subRows.length > 0 || !!latest.current.getRowHasChildren(row.original)
    }),
    [tableData, childrenOf]
  );
  return useMemo(
    () => ({
      tableOptions,
      getStatus: (id) => status[id],
      isLoading: (id) => status[id]?.state === 'loading',
      retry,
      invalidate
    }),
    [tableOptions, status, retry, invalidate]
  );
}

/* The loading or error row under an expanded lazy parent. The table renders
 it after the parent whenever `<DataGrid lazyRows>` reports a status. */
export function DataGridTableLazyStatusRow({ row, indent = 20, getRowLabel }) {
  const { props, table } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const status = props.lazyRows?.getStatus?.(row.id);
  if (!status || !row.getIsExpanded()) return null;
  const label = getDataGridRowLabel(row, getRowLabel);
  const columns = table.getVisibleLeafColumns();
  const fill = props.tableLayout?.columnsResizable ? 1 : 0;
  // Status content starts under the tree column (`meta.treeColumn`), so the
  // leading drag and select columns stay empty and the indent lines up.
  const treeIndex = Math.max(0, columns.findIndex((column) => column.columnDef.meta?.treeColumn));
  const padding = { '--data-grid-tree-padding': `${(row.depth + 1) * indent}px` };
  const cellSpacing = props.tableLayout?.dense ? 'px-2 py-1.5' : 'px-3 py-2';
  const bodyRowBottomBorderClasses = '[&:not(:last-child)>td]:border-b';
  const lead = treeIndex > 0 ? <td aria-hidden='true' colSpan={treeIndex} /> : null;
  if (status.state === 'error') {
    return (
      <tr
        data-slot='data-grid-table-lazy-status-row'
        data-status='error'
        className={cn(props.tableLayout?.rowBorder && bodyRowBottomBorderClasses)}
      >
        {lead}
        <td colSpan={columns.length - treeIndex + fill} className={cn('align-middle', cellSpacing)}>
          <div
            role='alert'
            style={padding}
            className='text-danger flex flex-wrap items-center gap-2 ps-(--data-grid-tree-padding) text-sm'
          >
            <RegistryIcon lucide='CircleAlert' className='size-4 shrink-0' aria-hidden='true' />
            <span className='min-w-0'>
              {labels.childrenLoadFailed(label)}
              {status.error?.message ? (
                <span className='text-ui-muted-foreground'> · {status.error.message}</span>
              ) : null}
            </span>
            <Button
              variant='outline'
              size='xs'
              onClick={(event) => {
                event.stopPropagation();
                props.lazyRows.retry(row.id);
              }}
            >
              <RegistryIcon lucide='RotateCcw' aria-hidden='true' />
              {labels.retry}
            </Button>
          </div>
        </td>
      </tr>
    );
  }
  // A skeleton row in the shape of the real rows: one bar per column, the
  // tree column's bar indented one level deeper than its parent.
  return (
    <tr
      data-slot='data-grid-table-lazy-status-row'
      data-status='loading'
      aria-busy='true'
      className={cn(props.tableLayout?.rowBorder && bodyRowBottomBorderClasses)}
    >
      {lead}
      {columns.slice(treeIndex).map((column, index) => (
        <td key={column.id} className={cn('align-middle', cellSpacing)}>
          {index === 0 ? <span className='sr-only' role='status'>{labels.loadingChildren(label)}</span> : null}
          {column.columnDef.meta?.skeleton ?? (
            <Skeleton
              aria-hidden='true'
              style={index === 0 ? padding : undefined}
              className={cn('h-3.5', index === 0 ? 'ms-(--data-grid-tree-padding) w-1/2' : 'w-2/3')}
            />
          )}
        </td>
      ))}
      {fill ? <td aria-hidden='true' className='p-0' /> : null}
    </tr>
  );
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

/**
 * Keeps a flat list's manual order: moves reported by drag and drop, the row
 * menu or the keyboard (`moveRow`, `handleDragEnd`), and `reset`, which puts
 * the original rows back in their original order and keeps rows added since
 * at the end. `isReordered` says whether there is an order to reset. Edit the
 * rows themselves through `setRows`.
 */
export function useDataGridRowOrder(initialRows, { getRowId = (row) => row.id } = {}) {
  const rowId = useRef(getRowId);
  rowId.current = getRowId;
  const [rows, setRows] = useState(initialRows);
  const rank = useMemo(
    () => new Map(initialRows.map((row, index) => [String(getRowId(row)), index])),
    // The order to reset to is the one the hook started with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const dataIds = useMemo(() => rows.map((row) => rowId.current(row)), [rows]);
  const moveRow = useCallback(
    (move) => setRows((old) => moveDataGridRow(old, move, { getRowId: rowId.current })),
    []
  );
  const handleDragEnd = useCallback(({ active, over }) => {
    if (!active || !over || active.id === over.id) return;
    setRows((old) => {
      const ids = old.map((row) => rowId.current(row));
      const from = ids.indexOf(active.id);
      const to = ids.indexOf(over.id);
      if (from === -1 || to === -1) return old;
      return moveDataGridRow(
        old,
        { id: active.id, targetId: over.id, position: from < to ? 'after' : 'before' },
        { getRowId: rowId.current }
      );
    });
  }, []);
  const rankOf = useCallback((row) => rank.get(String(rowId.current(row))) ?? Number.POSITIVE_INFINITY, [rank]);
  const reset = useCallback(
    () => setRows((old) => old.map((row, index) => ({ row, index })).sort((a, b) => rankOf(a.row) - rankOf(b.row) || a.index - b.index).map(({ row }) => row)),
    [rankOf]
  );
  const known = rows.filter((row) => Number.isFinite(rankOf(row)));
  const isReordered = known.some((row, index) => index > 0 && rankOf(known[index - 1]) > rankOf(row));
  return { rows, setRows, dataIds, moveRow, handleDragEnd, reset, isReordered };
}

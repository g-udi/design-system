'use client';
/* Tree controls for the DataGrid: cascading tri-state selection, a grand-total
 footer for rollup columns, and an expand-all / collapse-all / expand-to-level
 menu. Pair them with `useDataGridLazyRows` and `meta.rollup` columns from
 data-grid-tree-rows-extended.jsx. */
import { useEffect, useRef, useState } from 'react';
import { useDataGrid } from './data-grid-extended.jsx';
import {
  DataGridTableFootRow,
  DataGridTableFootRowCell
} from './data-grid-table-extended.jsx';
import {
  getDataGridTreeTotal,
  renderDataGridRollup,
  useDataGridStructureLabels
} from './data-grid-tree-rows-extended.jsx';
import { Subscribe } from '@tanstack/react-table-v9';
import { default as Button } from '../../Button/index.js';
import { Checkbox } from '../../Checkbox/parts/checkbox.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/* --- Cascading selection -------------------------------------------------- */

const canSelect = (row) => row.getCanSelect?.() !== false;
/**
 * A tree row's checkbox state, derived from its descendants: `true` when every
 * selectable descendant is selected, `'indeterminate'` when some are, and the
 * row's own selection for leaves (including lazy parents not loaded yet).
 */
export function getDataGridTreeSelectionState(row, selection = row.table.atoms.rowSelection?.get() ?? {}) {
  const children = row.subRows?.filter(canSelect) ?? [];
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
function applyTreeSelection(next, row, value) {
  const visit = (current) => {
    if (canSelect(current)) {
      if (value) next[current.id] = true;
      else delete next[current.id];
    }
    current.subRows?.forEach(visit);
  };
  visit(row);
  let parent = row.getParentRow?.();
  while (parent) {
    const children = parent.subRows.filter(canSelect);
    if (canSelect(parent)) {
      if (children.length && children.every((child) => next[child.id])) next[parent.id] = true;
      else delete next[parent.id];
    }
    parent = parent.getParentRow?.();
  }
}
export function toggleDataGridTreeRowSelected(row, value) {
  row.table.setRowSelection((old) => {
    const next = { ...old };
    applyTreeSelection(next, row, value ?? getDataGridTreeSelectionState(row) !== true);
    return next;
  });
}
/**
 * The checkbox for a tree row. Checking a parent checks every descendant;
 * the parent reads checked when all of them are, and mixed when some are.
 * Children that load later under a checked parent arrive checked.
 */
export function DataGridTableTreeRowSelect({ row }) {
  const { i18n } = useDataGrid();
  const childIds = row.subRows?.map((child) => child.id).join('|') ?? '';
  // A selected parent whose children just loaded passes the selection down.
  useEffect(() => {
    const selection = row.table.atoms.rowSelection?.get() ?? {};
    if (!selection[row.id] || !row.subRows?.length) return;
    if (row.subRows.some((child) => canSelect(child) && !selection[child.id])) {
      toggleDataGridTreeRowSelected(row, true);
    }
    // Only a change of children can break the invariant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childIds]);
  return (
    <Subscribe source={row.table.atoms.rowSelection}>
      {() => (
        <Checkbox
          checked={getDataGridTreeSelectionState(row)}
          disabled={!canSelect(row)}
          onCheckedChange={(value) => toggleDataGridTreeRowSelected(row, value === true)}
          onClick={(event) => event.stopPropagation()}
          aria-label={i18n.labels.selectRow}
          className='align-[inherit]'
        />
      )}
    </Subscribe>
  );
}
/** Select all for a tree: every filtered row at every depth. */
export function DataGridTableTreeRowSelectAll() {
  const { i18n, table, recordCount, isLoading } = useDataGrid();
  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => {
        const roots = table.getFilteredRowModel().rows.filter(canSelect);
        const states = roots.map((row) => getDataGridTreeSelectionState(row));
        const all = states.length > 0 && states.every((state) => state === true);
        const some = states.some((state) => state !== false);
        return (
          <Checkbox
            checked={all ? true : some ? 'indeterminate' : false}
            disabled={isLoading || recordCount === 0}
            onCheckedChange={(value) =>
              table.setRowSelection((old) => {
                const next = { ...old };
                for (const row of roots) applyTreeSelection(next, row, value === true);
                return next;
              })
            }
            aria-label={i18n.labels.selectAll}
            className='align-[inherit]'
          />
        );
      }}
    </Subscribe>
  );
}

/* --- Grand totals --------------------------------------------------------- */

/**
 * A footer row of grand totals for a tree: every `meta.rollup` column
 * aggregates all filtered leaves once, whatever their depth; the first column
 * that is not a rollup carries the label.
 */
export function DataGridTableTreeTotals({ label, labelColumnId }) {
  const { table } = useDataGrid();
  const columns = [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns()
  ];
  const labelIndex = labelColumnId
    ? Math.max(0, columns.findIndex((column) => column.id === labelColumnId))
    : Math.max(0, columns.findIndex((column) => column.columnDef.meta?.treeColumn));
  const cells = [];
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    const meta = column.columnDef.meta;
    if (index === labelIndex) {
      // The label spans forward over the columns that have nothing to total.
      let span = 1;
      while (index + span < columns.length && !columns[index + span].columnDef.meta?.rollup) span++;
      cells.push(
        <DataGridTableFootRowCell key={column.id} colSpan={span > 1 ? span : undefined}>
          {label}
        </DataGridTableFootRowCell>
      );
      index += span - 1;
      continue;
    }
    cells.push(
      <DataGridTableFootRowCell key={column.id} className={meta?.cellClassName}>
        {meta?.rollup
          ? renderDataGridRollup({ column, table, value: getDataGridTreeTotal(table, column), scope: 'total' })
          : null}
      </DataGridTableFootRowCell>
    );
  }
  return <DataGridTableFootRow>{cells}</DataGridTableFootRow>;
}

/* --- Expand to level ------------------------------------------------------ */

function getMaxDepth(table) {
  let depth = 0;
  for (const row of table.getCoreRowModel().flatRows) {
    if (row.getCanExpand()) depth = Math.max(depth, row.depth + 1);
  }
  return depth;
}
function expandedToLevel(table, level) {
  const expanded = {};
  for (const row of table.getCoreRowModel().flatRows) {
    if (row.depth < level && row.getCanExpand()) expanded[row.id] = true;
  }
  return expanded;
}
/**
 * Expand all, collapse all, or open every row above a depth. "Level 2" opens
 * the top two levels. With lazy rows, children that arrive while a level is
 * active open too, so the tree fills in to the chosen depth.
 */
export function DataGridTreeExpand({ levels, label, size = 'sm', className }) {
  const { table } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const [active, setActive] = useState(null);
  const applied = useRef(new Set());
  const maxDepth = levels ?? getMaxDepth(table);
  const flatRows = table.getCoreRowModel().flatRows;
  useEffect(() => {
    if (typeof active !== 'number') return;
    const fresh = flatRows.filter(
      (row) => row.depth < active && row.getCanExpand() && !applied.current.has(row.id)
    );
    if (!fresh.length) return;
    fresh.forEach((row) => applied.current.add(row.id));
    table.setExpanded((old) => {
      const next = old === true ? {} : { ...old };
      for (const row of fresh) next[row.id] = true;
      return next;
    });
  }, [active, flatRows, table]);
  const choose = (value) => {
    applied.current = new Set();
    if (value === 'all') {
      setActive('all');
      table.setExpanded(true);
      return;
    }
    const level = Number(value);
    setActive(level);
    const next = expandedToLevel(table, level);
    Object.keys(next).forEach((id) => applied.current.add(id));
    table.setExpanded(next);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size={size} className={className}>
          <RegistryIcon lucide='ListTree' aria-hidden='true' />
          {label ?? labels.expandLevels}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-44'>
        <DropdownMenuItem onSelect={() => choose('all')}>{labels.expandAll}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => choose(0)}>{labels.collapseAll}</DropdownMenuItem>
        {maxDepth > 1 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{labels.expandToLevel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={typeof active === 'number' ? String(active) : ''}
              onValueChange={(value) => choose(value)}
            >
              {Array.from({ length: maxDepth }, (_, index) => (
                <DropdownMenuRadioItem key={index} value={String(index + 1)}>
                  {labels.level(index + 1)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

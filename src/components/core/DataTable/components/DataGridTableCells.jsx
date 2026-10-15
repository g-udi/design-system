'use client';
import {
  useDataGrid
} from '../DataGrid.jsx';
import { flexRender, Subscribe } from '@tanstack/react-table';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { DataGridCellErrorIndicator, DataGridRowEditCell } from './DataGridEditing.jsx';
import {
  getPinningStyles,
  getDataGridTableOrderedVisibleColumns,
  getDataGridTreeIndentStyle,
  hasDataGridTableRightPinnedColumns
} from '../dataGridTableModel.js';
import { isDataGridCellInteractiveTarget } from '../dataGridTableDom.js';
import { getDataGridCellSelectionCellAttrs, dataGridCellSelectionCellClasses, toDataGridDomId } from '../dataGridModel.js';
function DataGridTableBodyRowCell({
  children,
  cell,
  dndRef,
  dndStyle,
  columnIndex
}) {
  const { props, table, gridId, columnPinningActive } = useDataGrid();
  const { column, row } = cell;
  const isPinned = columnPinningActive && column.getIsPinned();
  const isLastStartPinned =
    isPinned === 'start' && column.getIsLastColumn('start');
  const isFirstEndPinned = isPinned === 'end' && column.getIsFirstColumn('end');
  const cellSelectionOn =
    !!props.tableLayout?.cellSelection && table.atoms.cellSelection != null;
  const rangeSelectionOn =
    cellSelectionOn && props.tableLayout?.cellSelectionMode !== 'single';
  // Editing hooks (DataGridEditing): the row in per-row edit mode
  // renders editors, and a cell with an error carries its message.
  const rowEditor =
    props.rowEditing?.rowId != null &&
    props.rowEditing.rowId === row.id &&
    !!column.columnDef.meta?.cellEdit &&
    !row.getIsGrouped?.();
  const cellError = rowEditor
    ? props.rowEditing.getError(column.id)
    : (props.getCellError?.(row.original, column.id) ?? null);
  const cellErrorId = cellError
    ? `${gridId}c-${toDataGridDomId(row.id)}-${toDataGridDomId(column.id)}-error`
    : void 0;
  const content = rowEditor ? (
    <DataGridRowEditCell cell={cell} errorId={cellErrorId} />
  ) : (
    children
  );
  const renderTd = (selection) => (
    <td
      ref={dndRef}
      id={
        cellSelectionOn
          ? `${gridId}c-${toDataGridDomId(row.id)}-${toDataGridDomId(column.id)}`
          : void 0
      }
      aria-colindex={cellSelectionOn ? getDataGridTableOrderedVisibleColumns(table).findIndex(item => item.id === column.id) + 1 : void 0}
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column, columnPinningActive)),
        // Paint containment clips at the padding edge, which would erase
        // the ::before selection chrome on pinned cells.
        ...(cellSelectionOn ? { contain: void 0 } : null),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`
        }),
        ...(dndStyle ? dndStyle : null)
      }}
      data-pinned={isPinned || void 0}
      data-last-col={
        isLastStartPinned ? 'start' : isFirstEndPinned ? 'end' : void 0
      }
      data-cell-status={
        cellError ? 'invalid' : props.getCellStatus?.(row.original, column.id)
      }
      // In edit mode the editor itself is invalid and described.
      aria-invalid={cellError && !rowEditor ? true : void 0}
      aria-describedby={!rowEditor ? cellErrorId : void 0}
      data-column-index={columnIndex}
      {...(selection ? selection : null)}
      onMouseDown={
        selection
          ? (event) => {
              if (event.button !== 0) return;
              if (isDataGridCellInteractiveTarget(event.target)) {
                if (
                  rangeSelectionOn &&
                  (event.shiftKey || event.metaKey || event.ctrlKey) &&
                  cell.getCanSelect()
                ) {
                  event.preventDefault();
                  cell.getSelectionStartHandler()(event);
                  return;
                }
                if (cell.getCanSelect()) {
                  if (rangeSelectionOn) {
                    cell.getSelectionStartHandler()(event);
                  } else {
                    table.setFocusedCell(row.id, column.id);
                  }
                }
                return;
              }
              if (!rangeSelectionOn) {
                if (cell.getCanSelect()) {
                  table.setFocusedCell(row.id, column.id);
                }
                return;
              }
              cell.getSelectionStartHandler()(event);
            }
          : void 0
      }
      onMouseEnter={
        rangeSelectionOn
          ? (event) => cell.getSelectionExtendHandler()(event)
          : void 0
      }
      className={cn(
        'align-middle',
        'ds-table-cell-spacing',
        // The classic edited-cell corner mark, active only when
        // getCellStatus is wired: amber for "dirty", destructive for
        // "invalid".
        (props.getCellError || props.rowEditing) &&
          'data-[cell-status=invalid]:bg-ui-destructive/5 data-[cell-status=invalid]:data-pinned:bg-[color-mix(in_oklab,var(--destructive)_5%,var(--background))]',
        (props.getCellStatus || props.getCellError || props.rowEditing) &&
          "data-[cell-status=invalid]:after:border-t-destructive data-[cell-status]:relative data-[cell-status]:after:absolute data-[cell-status]:after:end-0 data-[cell-status]:after:top-0 data-[cell-status]:after:size-0 data-[cell-status]:after:border-s-[5px] data-[cell-status]:after:border-t-[5px] data-[cell-status]:after:border-s-transparent data-[cell-status]:after:content-[''] data-[cell-status=dirty]:after:border-t-amber-500",
        props.tableLayout?.cellBorder && 'border-e',
        // Mirror of the head cell rule: no floating border against the
        // resize filler strip.
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable && // With end-pinned columns but no pin affordance, the pinned edge
          // draws no separator of its own; keep the border then.
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          !isPinned &&
          column.getIsLastColumn('center') &&
          'border-e-0',
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          !cellSelectionOn &&
          'truncate',
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          cn(
            'data-pinned:bg-ui-background data-pinned:isolate',
            '[&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]',
            '[&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)]'
          ),
        column.getIndex() === 0 ||
          column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : '',
        selection && dataGridCellSelectionCellClasses
      )}
    >
      {/* With cell selection on, the td must not clip (its ::before paints
       the selection chrome 1px outside the cell), so the resize
       truncation moves to an inner wrapper that clips at the same
       boundary the td used to. */}
      {cellSelectionOn &&
      props.tableLayout?.columnsResizable &&
      column.getCanResize() ? (
        <div
          className='ds-table-cell-truncate'
        >
          {content}
        </div>
      ) : (
        content
      )}
      {cellError ? (
        <DataGridCellErrorIndicator
          id={cellErrorId}
          message={cellError}
          focused={!!selection?.['data-cell-focused']}
        />
      ) : null}
      {props.tableLayout?.cellFillHandle &&
        selection?.['data-cell-edge-bottom'] &&
        selection['data-cell-edge-right'] && (
          <span
            data-slot='data-grid-cell-fill-handle'
            className={cn(
              'absolute z-10 cursor-crosshair touch-none in-data-[cell-editing]:hidden in-data-[cell-selecting]:hidden',
              props.tableLayout?.cellFillHandleVariant === 'ring'
                ? 'border-ui-primary bg-ui-background -end-[5px] -bottom-[5px] size-[11px] rounded-full border-2 in-[td:has(+[data-slot=data-grid-table-fill-body-cell]+td[data-pinned])]:end-0 in-[td:has(+[data-slot=data-grid-table-fill-body-cell]:last-child)]:end-0 in-[td:has(+td[data-pinned])]:end-0 in-[td:last-child]:end-0 in-[tr:last-child]:bottom-0'
                : props.tableLayout?.cellFillHandleVariant === 'square'
                  ? /* Abutting the cell borders from inside: no gap and no
           overlap, so the square cannot merge with a gridline
           into a wider-than-tall blob, and it can never leave
           the grid, which is why it needs no boundary clamps. */
                    'bg-ui-primary end-0 bottom-0 size-[5px]'
                  : 'bg-ui-primary border-ui-background end-0 bottom-0 size-[9px] rounded-full border',
              props.tableClassNames?.cellFillHandle
            )}
          />
        )}
    </td>
  );
  if (!cellSelectionOn) return renderTd(null);
  return (
    <Subscribe
      source={table.atoms.cellSelection}
      selector={() => getDataGridCellSelectionCellAttrs(cell)}
    >
      {(selection) => renderTd(selection)}
    </Subscribe>
  );
}
/* The group band's leading cell: a disclosure for the group, its value
 rendered by the column's own cell (a status badge stays a badge) and the
 number of records inside it. */
function DataGridTableGroupedCell({ cell }) {
  const { i18n, props } = useDataGrid();
  const { row } = cell;
  const expanded = row.getIsExpanded();
  const meta = cell.column.columnDef.meta;
  const label = String(row.groupingValue ?? cell.getValue() ?? '');
  const count = row.leafRows?.length ?? row.subRows.length;
  return (
    <span
      data-slot='data-grid-table-group'
      style={getDataGridTreeIndentStyle(row)}
      className='inline-flex max-w-full min-w-0 items-center gap-1.5 ps-(--data-grid-tree-padding) align-middle font-medium'
    >
      <Button
        variant='ghost'
        tone='neutral'
        size={props.tableLayout?.dense ? 'icon-xs' : 'icon-sm'}
        aria-expanded={expanded}
        aria-label={
          expanded ? i18n.labels.collapseGroup(label) : i18n.labels.expandGroup(label)
        }
        onClick={(event) => {
          event.stopPropagation();
          row.toggleExpanded();
        }}
        className='text-ui-muted-foreground hover:text-ui-foreground shrink-0'
      >
        <RegistryIcon
          lucide='ChevronDown'
          className='size-4 transition-transform duration-200 in-aria-[expanded=false]:-rotate-90 rtl:in-aria-[expanded=false]:rotate-90'
        />
      </Button>
      <span className='min-w-0 shrink truncate'>
        {flexRender(meta?.groupedCell ?? cell.column.columnDef.cell, cell.getContext())}
      </span>
      {/* A compact count for the eye; the full phrase for assistive technology. */}
      <span
        aria-hidden='true'
        className='text-ui-muted-foreground bg-ui-muted rounded-pill shrink-0 px-1.5 text-xs leading-5 font-normal tabular-nums'
      >
        {count}
      </span>
      <span className='sr-only'>{i18n.labels.groupRowCount(count)}</span>
    </span>
  );
}
export { DataGridTableBodyRowCell, DataGridTableGroupedCell };

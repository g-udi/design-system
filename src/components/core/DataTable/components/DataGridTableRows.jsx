'use client';
import { Fragment, memo } from 'react';
import { useMergedRefs } from '../../../../hooks/state/use-merged-refs.js';
import { useDataGrid } from '../DataGrid.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { Loader } from '../../Loader/LoaderPrimitives.jsx';
import { DataGridTableLazyStatusRow } from './DataGridTreeRows.jsx';
import {
  getDataGridTableResolvedRows,
  getDataGridTableOrderedVisibleCells,
  hasDataGridTableRightPinnedColumns
} from '../dataGridTableModel.js';
import { isDataGridCellInteractiveTarget } from '../dataGridTableDom.js';
import {
  DataGridTableFillBodyCell,
  DataGridTableBodySkeleton,
  DataGridTableEmpty
} from './DataGridTableStructure.jsx';
import {
  DataGridTableBodyRowCell,
  DataGridTableGroupedCell
} from './DataGridTableCells.jsx';
import { renderDataGridCellContent } from '../dataGridCellContent.js';
function DataGridTableBodyRow({
  children,
  row,
  pinnedBoundary,
  rowRef,
  dndRef,
  dndStyle,
  dataIndex
}) {
  const { props, table } = useDataGrid();
  const ref = useMergedRefs(rowRef, dndRef);
  const isRowPinned = row.getIsPinned();
  const rowStatus = props.getRowStatus?.(row.original);
  const bodyRowBottomBorderClasses =
    '[&:not(:last-child)>td]:border-b [tbody:has(+tfoot)_&:last-child>td]:border-b [*:has(>[data-slot=data-grid]+[data-slot=data-grid-pagination])_[data-slot=data-grid]_&:last-child>td]:border-b';
  return (
    <tr
      ref={ref}
      style={{ ...(dndStyle ? dndStyle : null) }}
      data-state={
        table.options.enableRowSelection && row.getIsSelected()
          ? 'selected'
          : void 0
      }
      data-index={dataIndex}
      data-row-id={row.id}
      data-depth={row.depth || void 0}
      data-row-pinned={isRowPinned || void 0}
      data-row-pinned-boundary={pinnedBoundary}
      data-row-status={rowStatus}
      data-row-editing={
        (props.rowEditing?.rowId != null &&
          props.rowEditing.rowId === row.id) ||
        void 0
      }
      data-row-grouped={row.getIsGrouped?.() || void 0}
      aria-rowindex={props.tableLayout?.cellSelection ? row.getDisplayIndex() + table.getHeaderGroups().length + 1 : void 0}
      tabIndex={props.onRowClick && !props.tableLayout?.cellSelection ? 0 : undefined}
      onClick={(event) => {
        if (!isDataGridCellInteractiveTarget(event.target)) props.onRowClick?.(row.original);
      }}
      onKeyDown={(event) => {
        if (!props.onRowClick || event.target !== event.currentTarget || event.nativeEvent.isComposing || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        props.onRowClick(row.original);
      }}
      className={cn(
        'hover:bg-ui-muted/40 data-[state=selected]:bg-ui-muted/50',
        /* Pinned cells hide scrolled content behind an OPAQUE background,
         which also hides the row's translucent hover and selected tints;
         they get the same tints premixed over the background instead,
         the row-status treatment. */
        'hover:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_40%,var(--background))]',
        'data-[state=selected]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]',
        props.onRowClick && 'cursor-pointer',
        // Optional CRUD indications, active only when getRowStatus is
        // wired; the warning and success tints yield to tableClassNames
        // overrides per status. Pinned cells must stay OPAQUE (they hide
        // scrolled content), so they get the same tint pre-mixed over the
        // background instead of inheriting the translucent row fill.
        props.getRowStatus &&
          'data-[row-status=deleted]:bg-ui-destructive/5 data-[row-status=deleted]:opacity-60 data-[row-status=dirty]:bg-warning/5 data-[row-status=new]:bg-success/5 data-[row-status=deleted]:[&_td]:line-through',
        props.getRowStatus &&
          'data-[row-status=deleted]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--destructive)_5%,var(--background))] data-[row-status=dirty]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--ds-color-warning)_5%,var(--background))] data-[row-status=new]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--ds-color-success)_5%,var(--background))]',
        rowStatus === 'new' && props.tableClassNames?.rowNew,
        rowStatus === 'dirty' && props.tableClassNames?.rowDirty,
        rowStatus === 'deleted' && props.tableClassNames?.rowDeleted,
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          bodyRowBottomBorderClasses,
        props.tableLayout?.cellBorder &&
          `*:last:border-e-0 ${bodyRowBottomBorderClasses}`,
        // Virtualized rows stripe by absolute row index (CSS :nth-child
        // parity flips as spacer rows resize while scrolling).
        props.tableLayout?.stripped &&
          (typeof dataIndex === 'number'
            ? cn(
                'hover:bg-transparent',
                dataIndex % 2 === 0 && 'bg-ui-muted/90 hover:bg-ui-muted'
              )
            : 'odd:bg-ui-muted/90 odd:hover:bg-ui-muted hover:bg-transparent'),
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          'bg-ui-muted/30 hover:bg-ui-muted/50',
        pinnedBoundary === 'top' &&
          '[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)] dark:[&>td]:shadow-[0_2px_0_rgba(255,255,255,0.06)]',
        // A bottom-pinned row borders scrolled content along its TOP edge,
        // so its separator shadow casts upward.
        pinnedBoundary === 'bottom' &&
          '[&>td]:shadow-[0_-2px_0_rgba(0,0,0,0.03)] dark:[&>td]:shadow-[0_-2px_0_rgba(255,255,255,0.06)]',
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          props.tableClassNames?.rowPinned,
        // Group bands read as section headers: a muted fill and medium weight.
        'data-[row-grouped]:bg-ui-muted/40 data-[row-grouped]:hover:bg-ui-muted/60 data-[row-grouped]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--muted)_40%,var(--background))]',
        // Per-row edit mode: the draft row reads as the one being edited.
        props.rowEditing &&
          'data-[row-editing]:bg-ui-primary/4 data-[row-editing]:hover:bg-ui-primary/4 data-[row-editing]:[&>td[data-pinned]]:bg-[color-mix(in_oklab,var(--primary)_4%,var(--background))]',
        props.tableClassNames?.bodyRow,
        row.getIsGrouped?.() && props.tableClassNames?.groupRow
      )}
    >
      {children}
    </tr>
  );
}
function DataGridTableBodyRowExpandded({ row }) {
  const { props, table } = useDataGrid();
  const expandedContent = table
    .getAllColumns()
    .find((column) => column.columnDef.meta?.expandedContent)?.columnDef
    .meta?.expandedContent;
  if (!expandedContent) return null;
  const bodyRowBottomBorderClasses =
    '[&:not(:last-child)>td]:border-b [tbody:has(+tfoot)_&:last-child>td]:border-b [*:has(>[data-slot=data-grid]+[data-slot=data-grid-pagination])_[data-slot=data-grid]_&:last-child>td]:border-b';
  return (
    <tr
      className={cn(props.tableLayout?.rowBorder && bodyRowBottomBorderClasses)}
    >
      <td
        colSpan={
          getDataGridTableOrderedVisibleCells(row).length +
          (props.tableLayout?.columnsResizable ? 1 : 0)
        }
      >
        {expandedContent(row.original)}
      </td>
    </tr>
  );
}
function DataGridTableRenderedRow({
  row,
  pinnedBoundary,
  rowRef,
  rowIndex,
  centerWindow
}) {
  const { props, table } = useDataGrid();
  const startVisibleCells = row.getStartVisibleCells();
  const centerVisibleCells = row.getCenterVisibleCells();
  const endVisibleCells = row.getEndVisibleCells();
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  const windowedCenterCells = centerWindow
    ? centerVisibleCells.slice(centerWindow.start, centerWindow.end + 1)
    : centerVisibleCells;
  const leadingSpacerSpan = centerWindow ? centerWindow.start : 0;
  const trailingSpacerSpan = centerWindow
    ? Math.max(0, centerVisibleCells.length - 1 - centerWindow.end)
    : 0;
  return (
    <Fragment>
      <DataGridTableBodyRow
        row={row}
        pinnedBoundary={pinnedBoundary}
        rowRef={rowRef}
        dataIndex={rowIndex}
      >
        {startVisibleCells.map((cell) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {renderDataGridCellContent(cell)}
          </DataGridTableBodyRowCell>
        ))}
        {leadingSpacerSpan > 0 && (
          <td
            aria-hidden='true'
            data-slot='data-grid-table-virtual-col-spacer'
            colSpan={leadingSpacerSpan}
          />
        )}
        {windowedCenterCells.map((cell, cellIndex) => (
          <DataGridTableBodyRowCell
            cell={cell}
            key={cell.id}
            columnIndex={centerWindow ? centerWindow.start + cellIndex : void 0}
          >
            {renderDataGridCellContent(cell)}
          </DataGridTableBodyRowCell>
        ))}
        {trailingSpacerSpan > 0 && (
          <td
            aria-hidden='true'
            data-slot='data-grid-table-virtual-col-spacer'
            colSpan={trailingSpacerSpan}
          />
        )}
        {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
          <DataGridTableFillBodyCell />
        ) : null}
        {endVisibleCells.map((cell) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {renderDataGridCellContent(cell)}
          </DataGridTableBodyRowCell>
        ))}
        {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
          <DataGridTableFillBodyCell />
        ) : null}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
      {row.getIsExpanded() && <DataGridTableLazyStatusRow row={row} />}
    </Fragment>
  );
}
function DataGridTableBodyRows({ table }) {
  const { i18n, isLoading, props } = useDataGrid();
  const pagination = table.state.pagination;
  if (isLoading && props.loadingMode === 'skeleton' && pagination?.pageSize) {
    return <DataGridTableBodySkeleton />;
  }
  if (isLoading && props.loadingMode === 'spinner') {
    return (
      <tr>
        <td
          colSpan={
            table.getVisibleFlatColumns().length +
            (props.tableLayout?.columnsResizable ? 1 : 0)
          }
          className='p-8'
        >
          <div className='flex items-center justify-center'>
            <Loader aria-hidden='true' className='text-ui-muted-foreground me-3 size-5' />
            {props.loadingMessage || i18n.labels.loading}
          </div>
        </td>
      </tr>
    );
  }
  const resolvedRows = getDataGridTableResolvedRows(
    table,
    props.tableLayout?.rowsPinnable
  );
  if (!resolvedRows.length) return <DataGridTableEmpty />;
  return (
    <>
      {resolvedRows.map(({ row, pinnedBoundary }) => (
        <DataGridTableRenderedRow
          key={row.id}
          row={row}
          pinnedBoundary={pinnedBoundary}
        />
      ))}
    </>
  );
}
const MemoizedDataGridTableBodyRows = memo(
  DataGridTableBodyRows,
  (_prev, next) =>
    !!next.table.state.columnResizing.isResizingColumn ||
    next.table._isSelectingCells === true
);
export { DataGridTableBodyRow, DataGridTableBodyRowExpandded, DataGridTableBodyRowCell, DataGridTableGroupedCell, DataGridTableRenderedRow, MemoizedDataGridTableBodyRows };

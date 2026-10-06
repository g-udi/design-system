'use client';
import { useDataGrid } from '../DataGrid.jsx';
import { flexRender } from '@tanstack/react-table';
import { cn } from '../../../../utilities/cn/index.js';
import { TableHead } from '../../../mdx/Table/TablePrimitives.jsx';
import {
  getPinningStyles,
  getDataGridTableOrderedVisibleColumns,
  getDataGridTableMergedHeaderGroups,
  hasDataGridTableRightPinnedColumns
} from '../dataGridTableModel.js';
import { DataGridTableFillHeadCell } from './DataGridTableStructure.jsx';
import { DataGridTableBase, DataGridTableViewport } from './DataGridTableFrame.jsx';
import { DataGridTableHeadRowCellResize } from './DataGridColumnResize.jsx';
function DataGridTableHead({ children }) {
  const { props } = useDataGrid();
  return (
    <thead
      className={cn(
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky
      )}
    >
      {children}
    </thead>
  );
}
function DataGridTableHeadRow({ children, rowId: _rowId, rowIndex = 0 }) {
  const { props } = useDataGrid();
  return (
    <tr
      aria-rowindex={props.tableLayout?.cellSelection ? rowIndex + 1 : void 0}
      className={cn(
        props.tableLayout?.headerBorder && '[&>th]:border-b',
        props.tableLayout?.cellBorder && '*:last:border-e-0',
        props.tableLayout?.stripped && 'bg-transparent',
        props.tableLayout?.headerBackground === false && 'bg-transparent',
        props.tableClassNames?.headerRow
      )}
    >
      {children}
    </tr>
  );
}
function DataGridTableHeadRowCell({ children, header, dndRef, dndStyle }) {
  const { props, table, columnPinningActive } = useDataGrid();
  const { column } = header;
  const isPinned = columnPinningActive && column.getIsPinned();
  const isFirstStartPinned =
    isPinned === 'start' && column.getIsFirstColumn('start');
  const isLastStartPinned =
    isPinned === 'start' && column.getIsLastColumn('start');
  const isFirstEndPinned = isPinned === 'end' && column.getIsFirstColumn('end');
  const isLastEndPinned = isPinned === 'end' && column.getIsLastColumn('end');
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1;
  const sortDirection = column.getIsSorted();
  return (
    <TableHead
      variant={props.tableLayout?.headerBackground ? 'muted' : 'plain'}
      ref={dndRef}
      scope='col'
      colSpan={header.colSpan > 1 ? header.colSpan : void 0}
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
            ? 'descending'
            : column.getCanSort()
              ? 'none'
              : void 0
      }
      aria-colindex={
        props.tableLayout?.cellSelection ? getDataGridTableOrderedVisibleColumns(table).findIndex(item => item.id === header.getLeafHeaders()[0].column.id) + 1 : void 0
      }
      data-col-id={column.id}
      style={{
        ...(props.tableLayout?.width === 'fixed' &&
          !props.tableLayout?.columnsResizable && {
            width: header.getSize()
          }),
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column, columnPinningActive)),
        // A sticky child does not ride a sticky ancestor: under a sticky
        // header the pinned cell's own position:sticky (horizontal) opts it
        // out of the thead's vertical stickiness, and the corner scrolls
        // away while its non-positioned siblings stick. Pin both axes on
        // the cell itself.
        ...(props.tableLayout?.headerSticky && isPinned && { top: 0 }),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--header-${header.id}-size) * 1px)`
        }),
        ...(dndStyle ? dndStyle : null)
      }}
      data-pinned={isPinned || void 0}
      data-outer-pinned-col={
        isFirstStartPinned ? 'start' : isLastEndPinned ? 'end' : void 0
      }
      data-last-col={
        isLastStartPinned ? 'start' : isFirstEndPinned ? 'end' : void 0
      }
      className={cn(
        'relative',
        !props.tableLayout?.headerBorder && 'border-b-0',
        props.tableLayout?.cellBorder && 'border-e',
        // The resize filler column follows the center group, and a border on
        // the last center cell would float against that empty strip.
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
          (isPinned ? 'overflow-hidden' : 'overflow-visible'),
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          isLastVisibleColumn &&
          'pe-8',
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          cn(
            'data-outer-pinned-col:bg-clip-padding data-pinned:isolate',
            '[&[data-pinned=end]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)] [&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]',
            '[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=start]_div.cursor-col-resize:last-child]:opacity-0'
          ),
        header.column.columnDef.meta?.headerClassName,
        // Edge detection spans the full visible leaf order; the header's own
        // group only covers one pinning bucket.
        column.getIndex() === 0 || isLastVisibleColumn
          ? props.tableClassNames?.edgeCell
          : ''
      )}
    >
      {children}
    </TableHead>
  );
}
function DataGridTableHeader() {
  const { table, props } = useDataGrid();
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table);
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        <DataGridTableHead>
          {mergedHeaderGroups.map((headerGroup, rowIndex) => {
            return (
              <DataGridTableHeadRow key={headerGroup.id} rowId={headerGroup.id} rowIndex={rowIndex}>
                {headerGroup.headers
                  .filter((header) => header.column.getIsPinned() !== 'end')
                  .map((header) => {
                    const { column } = header;
                    return (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {props.tableLayout?.columnsResizable &&
                          column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    );
                  })}
                {props.tableLayout?.columnsResizable &&
                hasRightPinnedColumns ? (
                  <DataGridTableFillHeadCell />
                ) : null}
                {headerGroup.headers
                  .filter((header) => header.column.getIsPinned() === 'end')
                  .map((header) => {
                    const { column } = header;
                    return (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {props.tableLayout?.columnsResizable &&
                          column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    );
                  })}
                {props.tableLayout?.columnsResizable &&
                !hasRightPinnedColumns ? (
                  <DataGridTableFillHeadCell />
                ) : null}
              </DataGridTableHeadRow>
            );
          })}
        </DataGridTableHead>
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}
export { DataGridTableHead, DataGridTableHeadRow, DataGridTableHeadRowCell, DataGridTableHeader };

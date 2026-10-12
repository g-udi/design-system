'use client';
import { useDataGrid } from '../DataGrid.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Loader } from '../../Loader/LoaderPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { TableHead } from '../../../mdx/Table/TablePrimitives.jsx';
import {
  getDataGridTableOrderedVisibleColumns,
  hasDataGridTableRightPinnedColumns,
  hasDataGridFillColumn
} from '../dataGridTableModel.js';
function DataGridTableFillCol() {
  const { props, table } = useDataGrid();
  if (!props.tableLayout?.columnsResizable) return null;
  return (
    <col
      data-slot='data-grid-table-fill-col'
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : 'var(--data-grid-fill-size, 0px)'
      }}
    />
  );
}
function DataGridTableFillHeadCell() {
  const { props, table } = useDataGrid();
  if (!props.tableLayout?.columnsResizable) return null;
  return (
    <TableHead
      variant={props.tableLayout?.headerBackground ? 'muted' : 'plain'}
      aria-hidden='true'
      data-slot='data-grid-table-fill-head-cell'
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : 'var(--data-grid-fill-size, 0px)'
      }}
      className={cn('p-0', !props.tableLayout?.headerBorder && 'border-b-0')}
    />
  );
}
function DataGridTableFillBodyCell() {
  const { props, table } = useDataGrid();
  if (!props.tableLayout?.columnsResizable) return null;
  return (
    <td
      aria-hidden='true'
      data-slot='data-grid-table-fill-body-cell'
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : 'var(--data-grid-fill-size, 0px)'
      }}
      className='p-0'
    />
  );
}
function DataGridTableFillFootCell() {
  const { props, table } = useDataGrid();
  if (!props.tableLayout?.columnsResizable) return null;
  return (
    <td
      aria-hidden='true'
      data-slot='data-grid-table-fill-foot-cell'
      style={{
        width: hasDataGridFillColumn(table)
          ? 0
          : 'var(--data-grid-fill-size, 0px)'
      }}
      className='p-0'
    />
  );
}
function DataGridTableAddRow() {
  const { i18n, props, table } = useDataGrid();
  if (!props.onRowCreate) return null;
  return (
    <tr
      data-slot='data-grid-table-add-row'
      className={cn(
        'hover:bg-ui-muted/40 [thead+tbody_&:first-child]:border-t',
        props.tableClassNames?.rowCreate
      )}
    >
      <td
        colSpan={
          table.getVisibleLeafColumns().length +
          (props.tableLayout?.columnsResizable ? 1 : 0)
        }
        className='p-0'
      >
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className={cn(
            'text-ui-muted-foreground flex w-full items-center justify-start rounded-none px-3',
            props.tableLayout?.dense ? 'h-8 px-2' : 'h-9'
          )}
          onClick={(event) => {
            const button = event.currentTarget;
            const grid = button.closest('table');
            props.onRowCreate?.();
            setTimeout(() => {
              if (
                !button.isConnected &&
                grid?.isConnected &&
                grid.tabIndex >= 0 &&
                (document.activeElement === document.body ||
                  !document.activeElement)
              ) {
                grid.focus();
              }
            }, 0);
          }}
        >
          <RegistryIcon
            lucide='PlusIcon'
            className='size-4'
            aria-hidden='true'
          />
          {props.rowCreateLabel ?? i18n.labels.rowCreate}
        </Button>
      </td>
    </tr>
  );
}
function DataGridTableRowSpacer() {
  return (
    <tbody
      aria-hidden='true'
      className='h-2'
      data-slot='data-grid-table-body-spacer'
    />
  );
}
function DataGridTableBody({ children }) {
  const { props } = useDataGrid();
  return (
    <tbody
      data-slot='data-grid-table-body'
      className={cn(
        props.tableLayout?.rowRounded && '[&_td:first-child]:rounded-l-lg',
        props.tableLayout?.rowRounded && '[&_td:last-child]:rounded-r-lg',
        props.tableClassNames?.body
      )}
    >
      {children}
    </tbody>
  );
}
function DataGridTableFoot({ children }) {
  const { props } = useDataGrid();
  return (
    <tfoot
      data-slot='data-grid-table-foot'
      className={cn(props.tableClassNames?.footer)}
    >
      {children}
    </tfoot>
  );
}
function DataGridTableFootRow({ children }) {
  const { props, table } = useDataGrid();
  const footRowBottomBorderClasses = '[&:not(:last-child)>td]:border-b';
  return (
    <tr
      data-slot='data-grid-table-foot-row'
      className={cn(
        props.tableLayout?.footerBackground &&
          'bg-ui-muted/40 dark:bg-ui-background',
        props.tableLayout?.rowBorder && footRowBottomBorderClasses,
        props.tableLayout?.cellBorder && '*:last:border-e-0',
        // The fill foot cell is the :last child, so the rule above only
        // strips the filler; the real last cell needs the same treatment or
        // its border floats into the strip while thead and tbody suppress
        // theirs. Same pin-affordance gate as the cell-level suppressors.
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable &&
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          '[&>td:has(+td[data-slot=data-grid-table-fill-foot-cell])]:border-e-0'
      )}
    >
      {children}
      <DataGridTableFillFootCell />
    </tr>
  );
}
function DataGridTableFootRowCell({ children, colSpan, className }) {
  const { props } = useDataGrid();
  return (
    <td
      colSpan={colSpan}
      className={cn(
        'text-ui-secondary-foreground align-middle font-medium',
        'ds-table-cell-spacing',
        props.tableLayout?.footerBackground &&
          'bg-ui-muted/40 dark:bg-ui-background',
        props.tableLayout?.cellBorder && 'border-e',
        className
      )}
    >
      {children}
    </td>
  );
}
function DataGridTableBodySkeleton() {
  const { props, table } = useDataGrid();
  const pagination = table.state.pagination;
  const leftVisibleColumns = table.getStartVisibleLeafColumns();
  const centerVisibleColumns = table.getCenterVisibleLeafColumns();
  const rightVisibleColumns = table.getEndVisibleLeafColumns();
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  return (
    <>
      {Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
        <DataGridTableBodyRowSkeleton key={rowIndex}>
          {[...leftVisibleColumns, ...centerVisibleColumns].map((column) => (
            <DataGridTableBodyRowSkeletonCell column={column} key={column.id}>
              {column.columnDef.meta?.skeleton}
            </DataGridTableBodyRowSkeletonCell>
          ))}
          {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
            <DataGridTableFillBodyCell />
          ) : null}
          {rightVisibleColumns.map((column) => (
            <DataGridTableBodyRowSkeletonCell column={column} key={column.id}>
              {column.columnDef.meta?.skeleton}
            </DataGridTableBodyRowSkeletonCell>
          ))}
          {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
            <DataGridTableFillBodyCell />
          ) : null}
        </DataGridTableBodyRowSkeleton>
      ))}
    </>
  );
}
function DataGridTableBodyRowSkeleton({ children }) {
  const { table: _table, props } = useDataGrid();
  return (
    <tr
      className={cn(
        'hover:bg-ui-muted/40 data-[state=selected]:bg-ui-muted/50',
        props.onRowClick && 'cursor-pointer',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-ui-border border-b [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '*:last:border-e-0',
        props.tableLayout?.stripped &&
          'odd:bg-ui-muted/90 odd:hover:bg-ui-muted hover:bg-transparent',
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
    </tr>
  );
}
function DataGridTableBodyRowSkeletonCell({ children, column }) {
  const { props, table } = useDataGrid();
  return (
    <td
      style={
        props.tableLayout?.columnsResizable
          ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
          : void 0
      }
      className={cn(
        'align-middle',
        'ds-table-cell-spacing',
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.cellBorder &&
          props.tableLayout?.columnsResizable && // With end-pinned columns but no pin affordance, the pinned edge
          // draws no separator of its own; keep the border then.
          (props.tableLayout?.columnsPinnable ||
            !hasDataGridTableRightPinnedColumns(table)) &&
          !column.getIsPinned() &&
          column.getIsLastColumn('center') &&
          'border-e-0',
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          'truncate',
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          'data-pinned:bg-ui-background data-pinned:isolate [&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)] [&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]',
        column.getIndex() === 0 ||
          column.getIndex() === table.getVisibleLeafColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : ''
      )}
    >
      {children}
    </td>
  );
}
function DataGridTableEmpty() {
  const { i18n, table, props } = useDataGrid();
  const visibleColumnCount =
    getDataGridTableOrderedVisibleColumns(table).length +
    (props.tableLayout?.columnsResizable ? 1 : 0);
  return (
    <tr>
      <td
        colSpan={Math.max(visibleColumnCount, 1)}
        className='text-ui-muted-foreground py-6 text-center text-sm'
      >
        {props.emptyMessage || i18n.labels.empty}
      </td>
    </tr>
  );
}
function DataGridTableLoader() {
  const { i18n, props } = useDataGrid();
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='text-ui-muted-foreground bg-ui-card rounded-lg flex items-center gap-2 border px-4 py-2 text-sm leading-none font-medium'>
        <Loader className='size-5 opacity-60' />
        {props.loadingMessage || i18n.labels.loading}
      </div>
    </div>
  );
}
export { DataGridTableBodySkeleton, DataGridTableFillHeadCell, DataGridTableFillBodyCell, DataGridTableAddRow, DataGridTableRowSpacer, DataGridTableBody, DataGridTableFoot, DataGridTableFootRow, DataGridTableFootRowCell, DataGridTableBodyRowSkeleton, DataGridTableBodyRowSkeletonCell, DataGridTableEmpty, DataGridTableLoader, DataGridTableFillCol };

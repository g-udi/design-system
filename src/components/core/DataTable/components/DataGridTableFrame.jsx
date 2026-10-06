'use client';
import { useIsomorphicLayoutEffect } from '../../../../hooks/state/use-isomorphic-layout-effect.js';
import { observeResize } from '../../../../utilities/observeResize.js';
import { useCallback, useMemo, useRef } from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { assignRef, getDataGridScrollAreaViewport } from '../dataGridTableDom.js';
import { hasDataGridTableRightPinnedColumns } from '../dataGridTableModel.js';
import { DataGridTableFillCol } from './DataGridTableStructure.jsx';
import { DataGridTableResizeIndicator } from './DataGridColumnResize.jsx';
function DataGridTableBase({ children }) {
  const { props, table, recordCount } = useDataGrid();
  const leftVisibleColumns = table.getStartVisibleLeafColumns();
  const centerVisibleColumns = table.getCenterVisibleLeafColumns();
  const rightVisibleColumns = table.getEndVisibleLeafColumns();
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  const columnSizeVars = useMemo(() => {
    if (!props.tableLayout?.columnsResizable) return void 0;
    const headers = table.getFlatHeaders();
    const fillColumnId = table
      .getVisibleLeafColumns()
      .find((column) => column.columnDef.meta?.fillWidth)?.id;
    const colSizes = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] =
        header.column.id === fillColumnId
          ? `calc(${header.column.getSize()} + var(--data-grid-fill, 0))`
          : header.column.getSize();
    }
    return colSizes;
    // The stable table can update these store snapshots without changing identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    table,
    props.tableLayout?.columnsResizable,
    // Visibility/order/pinning change the flat header set, so a column shown
    // after mount must get its size variable even though sizing is untouched.

    table.state.columnSizing,

    table.state.columnVisibility,

    table.state.columnOrder,

    table.state.columnPinning,
    // A def swap can change a column's `size` without touching sizing
    // STATE; without this dep the CSS variables keep the old widths. For a
    // consumer defining columns inline the memo degrades to per-render
    // recompute, which is the safe direction.

    table.options.columns
  ]);
  const cellSelectionOn =
    !!props.tableLayout?.cellSelection && table.atoms.cellSelection != null;
  return (
    <table
      data-slot='data-grid-table'
      data-density={props.tableLayout?.dense ? 'compact' : 'normal'}
      role={cellSelectionOn ? 'grid' : void 0}
      aria-multiselectable={
        cellSelectionOn && props.tableLayout?.cellSelectionMode !== 'single'
          ? true
          : void 0
      }
      aria-rowcount={
        cellSelectionOn
          ? Math.max(recordCount ?? 0, table.getRowsInDisplayOrder().length) + table.getHeaderGroups().length
          : void 0
      }
      className={cn(
        'ds-part-table text-ui-foreground text-left align-middle font-normal rtl:text-right',
        props.tableLayout?.columnsResizable ? 'min-w-0' : 'w-full min-w-full',
        props.tableLayout?.width === 'auto' ? 'table-auto' : 'table-fixed',
        !props.tableLayout?.columnsResizable && '',
        !props.tableLayout?.columnsDraggable &&
          'border-separate border-spacing-0',
        props.tableClassNames?.base
      )}
      style={
        props.tableLayout?.columnsResizable
          ? {
              ...columnSizeVars,
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`
            }
          : void 0
      }
    >
      <colgroup>
        {[...leftVisibleColumns, ...centerVisibleColumns].map((column) => (
          <col
            key={column.id}
            style={
              props.tableLayout?.columnsResizable
                ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
                : props.tableLayout?.width === 'fixed'
                  ? { width: column.getSize() }
                  : void 0
            }
          />
        ))}
        {hasRightPinnedColumns ? <DataGridTableFillCol /> : null}
        {rightVisibleColumns.map((column) => (
          <col
            key={column.id}
            style={
              props.tableLayout?.columnsResizable
                ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
                : props.tableLayout?.width === 'fixed'
                  ? { width: column.getSize() }
                  : void 0
            }
          />
        ))}
        {!hasRightPinnedColumns ? <DataGridTableFillCol /> : null}
      </colgroup>
      {children}
    </table>
  );
}
function DataGridTableViewport({ children, className, viewportRef, style }) {
  const { props, table, autoSize } = useDataGrid();
  const isColumnsResizable = !!props.tableLayout?.columnsResizable;
  const viewportNodeRef = useRef(null);
  const fillStateRef = useRef({ containerWidth: 0, appliedFill: -1 });
  const stopContainerObserverRef = useRef(null);
  const syncFillWidth = useCallback(() => {
    const node = viewportNodeRef.current;
    if (!node) return;
    const freeSpace =
      fillStateRef.current.containerWidth - table.getTotalSize();
    const fillWidth = Math.max(0, freeSpace);
    if (fillStateRef.current.appliedFill !== fillWidth) {
      fillStateRef.current.appliedFill = fillWidth;
      node.style.setProperty('--data-grid-fill-size', `${fillWidth}px`);
      node.style.setProperty('--data-grid-fill', String(fillWidth));
    }
    autoSize?.apply(freeSpace);
  }, [autoSize, table]);
  const handleViewportRef = useCallback(
    (node) => {
      stopContainerObserverRef.current?.();
      stopContainerObserverRef.current = null;
      viewportNodeRef.current = node;
      assignRef(viewportRef, node);
      if (!node) return;
      if (!isColumnsResizable) {
        fillStateRef.current.appliedFill = -1;
        node.style.removeProperty('--data-grid-fill-size');
        node.style.removeProperty('--data-grid-fill');
        return;
      }
      const scrollViewport =
        getDataGridScrollAreaViewport(node) ?? node.parentElement;
      const measurementTarget = scrollViewport ?? node;
      const measure = () => {
        fillStateRef.current.containerWidth = measurementTarget.clientWidth;
        syncFillWidth();
      };
      measure();
      if (typeof ResizeObserver !== 'undefined') {
        const observer = observeResize(measure);
        observer.observe(measurementTarget);
        stopContainerObserverRef.current = () => observer.disconnect();
      }
    },
    [isColumnsResizable, syncFillWidth, viewportRef]
  );
  useIsomorphicLayoutEffect(() => {
    if (!isColumnsResizable) return;
    syncFillWidth();
  });
  return (
    <div
      data-slot='data-grid-table-viewport'
      ref={handleViewportRef}
      className={cn('relative min-w-full align-top', className)}
      style={{
        ...(isColumnsResizable
          ? {
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`
            }
          : void 0),
        ...style
      }}
    >
      {children}
      <DataGridTableResizeIndicator viewportNodeRef={viewportNodeRef} />
    </div>
  );
}
export { DataGridTableBase, DataGridTableViewport };

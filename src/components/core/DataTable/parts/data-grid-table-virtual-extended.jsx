// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
const EMPTY_VIRTUAL_ITEMS = Object.freeze([]);
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDataGrid } from './data-grid-extended.jsx';
import {
  DataGridTableAddRow,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFillHeadCell,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRenderedRow,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridScrollAreaViewport,
  getDataGridTableMergedHeaderGroups,
  getDataGridTableRowSections,
  getPinningStyles,
  hasDataGridTableRightPinnedColumns
} from './data-grid-table-extended.jsx';
import { flexRender } from '@tanstack/react-table-v9';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../../../utilities/cn/index.js';
import { Spinner } from '../../Spinner/parts/spinner.jsx';
function isSameDataGridTableColumnScrollRequest(previous, next) {
  return (
    previous?.align === next.align &&
    previous.behavior === next.behavior &&
    previous.columnId === next.columnId &&
    previous.columnIndex === next.columnIndex &&
    previous.scrollElement === next.scrollElement
  );
}
function isSameDataGridTableScrollRequest(previous, next) {
  return (
    previous?.align === next.align &&
    previous.behavior === next.behavior &&
    previous.containerElement === next.containerElement &&
    previous.headerSticky === next.headerSticky &&
    previous.isVirtualizationEnabled === next.isVirtualizationEnabled &&
    previous.rowId === next.rowId &&
    previous.rowIndex === next.rowIndex &&
    previous.scrollElement === next.scrollElement
  );
}
function getDataGridTableScrollTarget({
  align,
  clientHeight,
  rowBottom,
  rowHeight,
  rowTop,
  scrollHeight,
  scrollTop,
  viewportTopOffset = 0
}) {
  const visibleHeight = Math.max(0, clientHeight - viewportTopOffset);
  const viewportTop = scrollTop + viewportTopOffset;
  const viewportBottom = scrollTop + clientHeight;
  const targetTop =
    align === 'auto'
      ? rowTop < viewportTop
        ? rowTop - viewportTopOffset
        : rowBottom > viewportBottom
          ? rowBottom - clientHeight
          : null
      : align === 'start'
        ? rowTop - viewportTopOffset
        : align === 'end'
          ? rowBottom - clientHeight
          : rowTop -
            viewportTopOffset -
            Math.max(0, (visibleHeight - rowHeight) / 2);
  if (targetTop === null) return null;
  return Math.min(
    Math.max(0, targetTop),
    Math.max(0, scrollHeight - clientHeight)
  );
}
function getDataGridTableHeaderOffset({
  containerElement,
  headerSticky,
  scrollElement
}) {
  if (!headerSticky) return 0;
  const headerElement = containerElement.querySelector(
    ':scope > [data-slot="data-grid-table"] > thead'
  );
  if (!headerElement) return 0;
  const scrollRect = scrollElement.getBoundingClientRect();
  const headerRect = headerElement.getBoundingClientRect();
  const headerBottomOffset = headerRect.bottom - scrollRect.top;
  const overlapsViewportTop =
    headerRect.top <= scrollRect.top + 0.5 && headerBottomOffset > 0;
  if (!overlapsViewportTop) return 0;
  return Math.min(scrollElement.clientHeight, Math.max(0, headerBottomOffset));
}
function scrollDataGridTableToOffset({
  behavior,
  scrollElement,
  targetTop,
  virtualizer
}) {
  if (virtualizer) {
    virtualizer.scrollToOffset(targetTop, { align: 'start', behavior });
  } else if (typeof scrollElement.scrollTo === 'function') {
    scrollElement.scrollTo({ behavior, top: targetTop });
  } else {
    scrollElement.scrollTop = targetTop;
  }
}
function scrollDataGridTableRowIntoView({
  align,
  behavior,
  cancelPendingScroll = false,
  containerElement,
  headerSticky,
  rowIndex,
  scrollElement,
  virtualizer
}) {
  if (!containerElement || !scrollElement) return false;
  const rowElement = containerElement.querySelector(
    `:scope > [data-slot="data-grid-table"] > tbody > tr[data-index="${rowIndex}"]`
  );
  if (!rowElement) return false;
  const scrollRect = scrollElement.getBoundingClientRect();
  const rowRect = rowElement.getBoundingClientRect();
  const viewportTopOffset = getDataGridTableHeaderOffset({
    containerElement,
    headerSticky,
    scrollElement
  });
  const rowTop = scrollElement.scrollTop + rowRect.top - scrollRect.top;
  const rowBottom = scrollElement.scrollTop + rowRect.bottom - scrollRect.top;
  const targetTop = getDataGridTableScrollTarget({
    align,
    clientHeight: scrollElement.clientHeight,
    rowBottom,
    rowHeight: rowRect.height || rowElement.offsetHeight,
    rowTop,
    scrollHeight: scrollElement.scrollHeight,
    scrollTop: scrollElement.scrollTop,
    viewportTopOffset
  });
  if (
    targetTop === null ||
    Math.abs(targetTop - scrollElement.scrollTop) < 0.5
  ) {
    if (cancelPendingScroll) {
      scrollDataGridTableToOffset({
        behavior: 'auto',
        scrollElement,
        targetTop: scrollElement.scrollTop,
        virtualizer
      });
    }
    return true;
  }
  scrollDataGridTableToOffset({
    behavior,
    scrollElement,
    targetTop,
    virtualizer
  });
  return true;
}
function DataGridTableVirtualPinnedPlaceholderCell({ column }) {
  const { props } = useDataGrid();
  const isPinned = column.getIsPinned();
  const isLastStartPinned =
    isPinned === 'start' && column.getIsLastColumn('start');
  const isFirstEndPinned = isPinned === 'end' && column.getIsFirstColumn('end');
  return (
    <td
      aria-hidden='true'
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`
        })
      }}
      data-pinned={isPinned || void 0}
      data-last-col={
        isLastStartPinned ? 'start' : isFirstEndPinned ? 'end' : void 0
      }
      className={cn(
        'p-0',
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          'data-pinned:bg-ui-background data-pinned:isolate [&[data-pinned=end][data-last-col=end]]:shadow-[inset_1px_0_0_0_var(--border)] [&[data-pinned=start][data-last-col=start]]:shadow-[inset_-1px_0_0_0_var(--border)]'
      )}
    />
  );
}
function DataGridTableVirtualUtilityRow({
  table,
  children,
  centerCellClassName,
  centerCellStyle,
  rowClassName,
  ariaHidden
}) {
  const { props } = useDataGrid();
  const leftVisibleColumns = table.getStartVisibleLeafColumns();
  const centerVisibleColumns = table.getCenterVisibleLeafColumns();
  const rightVisibleColumns = table.getEndVisibleLeafColumns();
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  return (
    <tr aria-hidden={ariaHidden || void 0} className={rowClassName}>
      {leftVisibleColumns.map((column) => (
        <DataGridTableVirtualPinnedPlaceholderCell
          column={column}
          key={column.id}
        />
      ))}
      <td
        colSpan={Math.max(centerVisibleColumns.length, 1)}
        className={centerCellClassName}
        style={centerCellStyle}
      >
        {children}
      </td>
      {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
        <DataGridTableFillBodyCell />
      ) : null}
      {rightVisibleColumns.map((column) => (
        <DataGridTableVirtualPinnedPlaceholderCell
          column={column}
          key={column.id}
        />
      ))}
      {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
        <DataGridTableFillBodyCell />
      ) : null}
    </tr>
  );
}
function DataGridTableVirtualSpacer({ table, height }) {
  if (height <= 0) return null;
  return (
    <DataGridTableVirtualUtilityRow
      table={table}
      ariaHidden
      centerCellClassName='p-0'
      centerCellStyle={{ height, padding: 0 }}
    >
      {null}
    </DataGridTableVirtualUtilityRow>
  );
}
function DataGridTableVirtualStatusRow({ table, children, className }) {
  return (
    <DataGridTableVirtualUtilityRow
      table={table}
      centerCellClassName={cn(
        'text-ui-muted-foreground py-4 text-center text-sm',
        className
      )}
    >
      {children}
    </DataGridTableVirtualUtilityRow>
  );
}
const MemoizedRenderedRow = memo(
  DataGridTableRenderedRow,
  (prev, next) =>
    prev.row === next.row &&
    prev.rowIndex === next.rowIndex &&
    prev.rowRef === next.rowRef &&
    prev.pinnedBoundary === next.pinnedBoundary &&
    prev.centerWindow?.start === next.centerWindow?.start &&
    prev.centerWindow?.end === next.centerWindow?.end
);
function DataGridTableVirtualBody({
  table,
  topRows,
  centerRows,
  bottomRows,
  virtualItems,
  totalSize,
  isVirtualizationEnabled,
  isInfiniteMode,
  isFetchingMore,
  hasMore,
  loadingMoreMessage,
  allRowsLoadedMessage,
  measureRowRef,
  centerColumnWindow
}) {
  const { isLoading } = useDataGrid();
  const totalRows = topRows.length + centerRows.length + bottomRows.length;
  if (!totalRows) {
    if (isLoading) {
      return (
        <DataGridTableVirtualStatusRow table={table}>
          <div className='flex items-center justify-center gap-2'>
            <Spinner className='size-4 opacity-60' />
            {loadingMoreMessage}
          </div>
        </DataGridTableVirtualStatusRow>
      );
    }
    return <DataGridTableEmpty />;
  }
  const hasCenterRows = centerRows.length > 0;
  const showFetchingRow = isInfiniteMode && isFetchingMore;
  const showCompleteRow = isInfiniteMode && hasMore === false && totalRows > 0;
  const hasMiddleSection = hasCenterRows || showFetchingRow || showCompleteRow;
  const leadingSpacerHeight =
    isVirtualizationEnabled && hasCenterRows && virtualItems.length > 0
      ? (virtualItems[0]?.start ?? 0)
      : 0;
  const trailingSpacerHeight =
    isVirtualizationEnabled && hasCenterRows && virtualItems.length > 0
      ? Math.max(
          0,
          totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0)
        )
      : 0;
  const renderedRows = [];
  topRows.forEach((row, index) => {
    renderedRows.push(
      <MemoizedRenderedRow
        key={row.id}
        row={row}
        centerWindow={centerColumnWindow}
        pinnedBoundary={
          index === topRows.length - 1 && hasMiddleSection ? 'top' : void 0
        }
      />
    );
  });
  if (isVirtualizationEnabled) {
    if (leadingSpacerHeight > 0) {
      renderedRows.push(
        <DataGridTableVirtualSpacer
          key='virtual-spacer-start'
          table={table}
          height={leadingSpacerHeight}
        />
      );
    }
    virtualItems.forEach((virtualRow) => {
      const row = centerRows[virtualRow.index];
      if (!row) return;
      renderedRows.push(
        <MemoizedRenderedRow
          key={row.id}
          row={row}
          rowRef={measureRowRef}
          rowIndex={virtualRow.index}
          centerWindow={centerColumnWindow}
        />
      );
    });
    if (trailingSpacerHeight > 0) {
      renderedRows.push(
        <DataGridTableVirtualSpacer
          key='virtual-spacer-end'
          table={table}
          height={trailingSpacerHeight}
        />
      );
    }
  } else {
    centerRows.forEach((row, rowIndex) => {
      renderedRows.push(
        <MemoizedRenderedRow
          key={row.id}
          row={row}
          rowIndex={rowIndex}
          centerWindow={centerColumnWindow}
        />
      );
    });
  }
  if (showFetchingRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow key='virtual-status-loading' table={table}>
        <div className='flex items-center justify-center gap-2'>
          <Spinner className='size-4 opacity-60' />
          {loadingMoreMessage}
        </div>
      </DataGridTableVirtualStatusRow>
    );
  }
  if (showCompleteRow) {
    renderedRows.push(
      <DataGridTableVirtualStatusRow
        key='virtual-status-complete'
        table={table}
        className='py-3 text-xs'
      >
        {allRowsLoadedMessage}
      </DataGridTableVirtualStatusRow>
    );
  }
  bottomRows.forEach((row, index) => {
    renderedRows.push(
      <MemoizedRenderedRow
        key={row.id}
        row={row}
        centerWindow={centerColumnWindow}
        pinnedBoundary={
          index === 0 && (topRows.length > 0 || hasMiddleSection)
            ? 'bottom'
            : void 0
        }
      />
    );
  });
  return <>{renderedRows}</>;
}
const MemoizedVirtualBody = memo(
  DataGridTableVirtualBody,
  (_prev, next) =>
    !!next.table.state.columnResizing.isResizingColumn ||
    next.table._isSelectingCells === true
);
function DataGridTableVirtual({
  height,
  estimateSize = 48,
  overscan = 10,
  scrollBehavior = 'auto',
  scrollToRowAlign = 'auto',
  scrollToRowIndex,
  columnVirtualizerOptions,
  scrollToColumnAlign = 'auto',
  scrollToColumnIndex,
  footerContent,
  renderHeader = true,
  onFetchMore,
  isFetchingMore = false,
  hasMore,
  fetchMoreOffset = 0,
  virtualizerOptions
}) {
  const { i18n, table, props } = useDataGrid();
  const mergedHeaderGroups = getDataGridTableMergedHeaderGroups(table);
  const hasRightPinnedColumns = hasDataGridTableRightPinnedColumns(table);
  const centerVisibleColumns = table.getCenterVisibleLeafColumns();
  const columnVirtualizationActive =
    columnVirtualizerOptions?.enabled === true &&
    props.tableLayout?.width !== 'auto' &&
    mergedHeaderGroups.length === 1 &&
    (mergedHeaderGroups[0]?.headers.every((header) => header.colSpan <= 1) ??
      false);
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    props.tableLayout?.rowsPinnable
  );
  const isInfiniteMode = typeof onFetchMore === 'function';
  const [viewportElements, setViewportElements] = useState({
    containerElement: null,
    scrollElement: null
  });
  const {
    estimateSize: customEstimateSize,
    getItemKey: customGetItemKey,
    getScrollElement: customGetScrollElement,
    measureElement: customMeasureElement,
    overscan: customOverscan,
    ...virtualizerOptionsRest
  } = virtualizerOptions ?? {};
  const isVirtualizationEnabled = virtualizerOptions?.enabled !== false;
  const loadingMoreMessage =
    props.fetchingMoreMessage || props.loadingMessage || i18n.labels.loading;
  const allRowsLoadedMessage =
    props.allRowsLoadedMessage || i18n.labels.allRowsLoaded;
  const handleViewportRef = useCallback((node) => {
    setViewportElements({
      containerElement: node,
      scrollElement: node ? (getDataGridScrollAreaViewport(node) ?? node) : null
    });
  }, []);
  const usesExternalScrollArea =
    viewportElements.scrollElement !== null &&
    viewportElements.scrollElement !== viewportElements.containerElement;
  const resolveScrollElement = useCallback(() => {
    if (customGetScrollElement) {
      return customGetScrollElement(viewportElements);
    }
    return viewportElements.scrollElement;
  }, [customGetScrollElement, viewportElements]);
  const resolveItemKey = useCallback(
    (index) => {
      const row = centerRows[index];
      if (!row) return index;
      return customGetItemKey?.(index, row) ?? row.id ?? index;
    },
    [centerRows, customGetItemKey]
  );
  const resolveEstimateSize = useCallback(
    (index) => {
      const row = centerRows[index];
      return row
        ? (customEstimateSize?.(index, row) ?? estimateSize)
        : estimateSize;
    },
    [centerRows, customEstimateSize, estimateSize]
  );
  const virtualizer = useVirtualizer({
    count: centerRows.length,
    getScrollElement: resolveScrollElement,
    getItemKey: resolveItemKey,
    estimateSize: resolveEstimateSize,
    overscan: customOverscan ?? overscan,
    measureElement: customMeasureElement,
    ...virtualizerOptionsRest
  });
  const isRtl = useMemo(
    () =>
      viewportElements.containerElement
        ? getComputedStyle(viewportElements.containerElement).direction ===
          'rtl'
        : false,
    [viewportElements.containerElement]
  );
  const resolveColumnKey = useCallback(
    (index) => centerVisibleColumns[index]?.id ?? index,
    [centerVisibleColumns]
  );
  const resolveColumnEstimateSize = useCallback(
    (index) => centerVisibleColumns[index]?.getSize() ?? 0,
    [centerVisibleColumns]
  );
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    isRtl,
    count: columnVirtualizationActive ? centerVisibleColumns.length : 0,
    getScrollElement: resolveScrollElement,
    getItemKey: resolveColumnKey,
    estimateSize: resolveColumnEstimateSize,
    overscan: columnVirtualizerOptions?.overscan ?? 3
  });
  useEffect(() => {
    if (columnVirtualizationActive) columnVirtualizer.measure();
  }, [
    columnVirtualizationActive,
    columnVirtualizer,

    table.state.columnSizing,

    table.state.columnVisibility,

    table.state.columnOrder,

    table.state.columnPinning
  ]);
  const virtualColumns = columnVirtualizationActive
    ? columnVirtualizer.getVirtualItems()
    : [];
  const centerColumnWindow =
    columnVirtualizationActive && virtualColumns.length > 0
      ? {
          start: virtualColumns[0].index,
          end: virtualColumns[virtualColumns.length - 1].index
        }
      : void 0;
  const virtualItems = isVirtualizationEnabled
    ? virtualizer.getVirtualItems()
    : EMPTY_VIRTUAL_ITEMS;
  const totalSize = isVirtualizationEnabled ? virtualizer.getTotalSize() : 0;
  const measureRowRef =
    isVirtualizationEnabled && customMeasureElement
      ? virtualizer.measureElement
      : void 0;
  const resolvedFetchMoreOffset = Math.max(0, fetchMoreOffset);
  const scrollToRowId =
    scrollToRowIndex !== void 0 ? centerRows[scrollToRowIndex]?.id : void 0;
  const scrollToRowVirtualItem =
    isVirtualizationEnabled && scrollToRowIndex !== void 0
      ? virtualItems.find((item) => item.index === scrollToRowIndex)
      : void 0;
  const pendingScrollToRowIndexRef = useRef(null);
  const lastScrollRequestRef = useRef(null);
  const fetchMoreFiredAtCountRef = useRef(null);
  const lastColumnScrollRequestRef = useRef(null);
  useEffect(() => {
    if (
      !columnVirtualizationActive ||
      scrollToColumnIndex === void 0 ||
      scrollToColumnIndex < 0 ||
      scrollToColumnIndex >= centerVisibleColumns.length ||
      !viewportElements.scrollElement
    ) {
      return;
    }
    const request = {
      align: scrollToColumnAlign,
      behavior: scrollBehavior,
      columnId: centerVisibleColumns[scrollToColumnIndex]?.id,
      columnIndex: scrollToColumnIndex,
      scrollElement: viewportElements.scrollElement
    };
    if (
      isSameDataGridTableColumnScrollRequest(
        lastColumnScrollRequestRef.current,
        request
      )
    ) {
      return;
    }
    lastColumnScrollRequestRef.current = request;
    columnVirtualizer.scrollToIndex(scrollToColumnIndex, {
      align: scrollToColumnAlign,
      behavior: scrollBehavior === 'smooth' ? 'smooth' : 'auto'
    });
  }, [
    columnVirtualizationActive,
    columnVirtualizer,
    centerVisibleColumns,
    scrollToColumnAlign,
    scrollToColumnIndex,
    scrollBehavior,
    viewportElements.scrollElement
  ]);
  useEffect(() => {
    const previousRequest = lastScrollRequestRef.current;
    if (
      scrollToRowIndex === void 0 ||
      scrollToRowIndex < 0 ||
      scrollToRowIndex >= centerRows.length
    ) {
      pendingScrollToRowIndexRef.current = null;
      lastScrollRequestRef.current = null;
      if (previousRequest) {
        const scrollElement2 = resolveScrollElement();
        if (scrollElement2) {
          scrollDataGridTableToOffset({
            behavior: 'auto',
            scrollElement: scrollElement2,
            targetTop: scrollElement2.scrollTop,
            virtualizer: isVirtualizationEnabled ? virtualizer : void 0
          });
        }
      }
      return;
    }
    const scrollElement = resolveScrollElement();
    const containerElement = viewportElements.containerElement;
    if (!containerElement || !scrollElement) return;
    const headerSticky = renderHeader && !!props.tableLayout?.headerSticky;
    const nextRequest = {
      align: scrollToRowAlign,
      behavior: scrollBehavior,
      containerElement,
      headerSticky,
      isVirtualizationEnabled,
      rowId: scrollToRowId,
      rowIndex: scrollToRowIndex,
      scrollElement
    };
    if (isSameDataGridTableScrollRequest(previousRequest, nextRequest)) return;
    pendingScrollToRowIndexRef.current = null;
    const rowWasHandled = scrollDataGridTableRowIntoView({
      align: scrollToRowAlign,
      behavior: scrollBehavior,
      cancelPendingScroll: previousRequest !== null,
      containerElement,
      headerSticky,
      rowIndex: scrollToRowIndex,
      scrollElement,
      virtualizer: isVirtualizationEnabled ? virtualizer : void 0
    });
    if (rowWasHandled) {
      lastScrollRequestRef.current = nextRequest;
      return;
    }
    if (!isVirtualizationEnabled) return;
    pendingScrollToRowIndexRef.current = scrollToRowIndex;
    lastScrollRequestRef.current = nextRequest;
    virtualizer.scrollToIndex(scrollToRowIndex, {
      align: scrollToRowAlign,
      behavior: scrollBehavior
    });
  });
  useEffect(() => {
    if (
      !isVirtualizationEnabled ||
      scrollToRowIndex === void 0 ||
      pendingScrollToRowIndexRef.current !== scrollToRowIndex ||
      !scrollToRowVirtualItem
    ) {
      return;
    }
    const rowWasHandled = scrollDataGridTableRowIntoView({
      align: scrollToRowAlign,
      behavior: 'auto',
      cancelPendingScroll: true,
      containerElement: viewportElements.containerElement,
      headerSticky: renderHeader && !!props.tableLayout?.headerSticky,
      rowIndex: scrollToRowIndex,
      scrollElement: resolveScrollElement(),
      virtualizer
    });
    if (rowWasHandled) {
      pendingScrollToRowIndexRef.current = null;
    }
  }, [
    isVirtualizationEnabled,
    props.tableLayout?.headerSticky,
    renderHeader,
    resolveScrollElement,
    scrollToRowAlign,
    scrollToRowIndex,
    scrollToRowVirtualItem,
    virtualizer,
    viewportElements.containerElement
  ]);
  useEffect(() => {
    if (
      !isVirtualizationEnabled ||
      !isInfiniteMode ||
      hasMore === false ||
      isFetchingMore
    ) {
      return;
    }
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (fetchMoreFiredAtCountRef.current === centerRows.length) return;
    if (lastItem.index >= centerRows.length - 1 - resolvedFetchMoreOffset) {
      fetchMoreFiredAtCountRef.current = centerRows.length;
      onFetchMore?.();
    }
  }, [
    centerRows.length,
    hasMore,
    isFetchingMore,
    isInfiniteMode,
    isVirtualizationEnabled,
    onFetchMore,
    resolvedFetchMoreOffset,
    virtualItems
  ]);
  const headerNode = useMemo(
    () =>
      renderHeader && (
        <DataGridTableHead>
          {mergedHeaderGroups.map((headerGroup) => (
            <DataGridTableHeadRow key={headerGroup.id} rowId={headerGroup.id}>
              {/* Under an active column window the single ungrouped header
               row is bucketed start / windowed center / end, with each
               off-window flank one colSpan spacer sized by the intact
               colgroup - the same shape the body rows take. */}
              {centerColumnWindow
                ? headerGroup.headers
                    .filter((header) => header.column.getIsPinned() === 'start')
                    .map((header) => (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {props.tableLayout?.columnsResizable &&
                          header.column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    ))
                : null}
              {centerColumnWindow && centerColumnWindow.start > 0 ? (
                <th
                  aria-hidden='true'
                  data-slot='data-grid-table-virtual-col-spacer'
                  colSpan={centerColumnWindow.start}
                  className='p-0'
                />
              ) : null}
              {centerColumnWindow
                ? headerGroup.headers
                    .filter((header) => !header.column.getIsPinned())
                    .slice(centerColumnWindow.start, centerColumnWindow.end + 1)
                    .map((header) => (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {props.tableLayout?.columnsResizable &&
                          header.column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    ))
                : null}
              {centerColumnWindow &&
              centerVisibleColumns.length - 1 - centerColumnWindow.end > 0 ? (
                <th
                  aria-hidden='true'
                  data-slot='data-grid-table-virtual-col-spacer'
                  colSpan={
                    centerVisibleColumns.length - 1 - centerColumnWindow.end
                  }
                  className='p-0'
                />
              ) : null}
              {!centerColumnWindow &&
                headerGroup.headers
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
              {props.tableLayout?.columnsResizable && hasRightPinnedColumns ? (
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
              {props.tableLayout?.columnsResizable && !hasRightPinnedColumns ? (
                <DataGridTableFillHeadCell />
              ) : null}
            </DataGridTableHeadRow>
          ))}
        </DataGridTableHead>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      renderHeader,
      table,
      props.tableLayout,
      centerColumnWindow,
      hasRightPinnedColumns
    ]
  );
  return (
    <DataGridTableViewport
      viewportRef={handleViewportRef}
      className={!usesExternalScrollArea ? 'block' : void 0}
      style={
        usesExternalScrollArea
          ? void 0
          : {
              height,
              overflow: 'auto',
              position: 'relative',
              // Standalone mode: this node IS the scroll container, so it
              // must stay at its parent's width (not the resizable table
              // width) or horizontal scrolling becomes impossible.
              width: 'auto'
            }
      }
    >
      <DataGridTableBase>
        {headerNode}

        {renderHeader &&
          (props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

        <DataGridTableBody>
          <MemoizedVirtualBody
            table={table}
            topRows={topRows}
            centerRows={centerRows}
            bottomRows={bottomRows}
            virtualItems={virtualItems}
            totalSize={totalSize}
            isVirtualizationEnabled={isVirtualizationEnabled}
            isInfiniteMode={isInfiniteMode}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            loadingMoreMessage={loadingMoreMessage}
            allRowsLoadedMessage={allRowsLoadedMessage}
            measureRowRef={measureRowRef}
            centerColumnWindow={centerColumnWindow}
          />
          {/* Same appended region as the standard body, so onRowCreate and
       a consumer draft work in the virtual layout too. */}
          {props.appendRow}
          <DataGridTableAddRow />
        </DataGridTableBody>

        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}
export { DataGridTableVirtual };

'use client';
import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { mergeDataGridI18n } from './dataGridLabels.jsx';
import { canPinTableColumns } from './dataGridTableModel.js';
import { setDataGridRowPinningMode } from './dataGridRowOrder.js';
import { cn } from '../../../utilities/cn/index.js';
const dataGridAutoSizeStates = /* @__PURE__ */ new WeakMap();
function getDataGridAutoSizeState(store) {
  let state = dataGridAutoSizeStates.get(store);
  if (!state) {
    state = {
      applied: null,
      settleTimer: null,
      pendingFreeSpace: 0,
      lastCommitAt: 0
    };
    dataGridAutoSizeStates.set(store, state);
  }
  return state;
}
function createDataGridAutoSizeController(getTable) {
  const SETTLE_MS = 150;
  const sizingState = getDataGridAutoSizeState(getTable().store);
  const reflow = (freeSpace) => {
    const table = getTable();
    const state = getDataGridAutoSizeState(table.store);
    const columnSizing =
      table.atoms.columnSizing?.get() ?? table.state.columnSizing;
    if (!state.applied) return false;
    const autoSizeColumn = table
      .getVisibleLeafColumns()
      .find(
        (column) => column.columnDef.meta?.autoSize && column.getCanResize()
      );
    if (!autoSizeColumn || autoSizeColumn.id !== state.applied.columnId)
      return false;
    const currentSize = columnSizing[state.applied.columnId];
    if (currentSize !== void 0 && currentSize !== state.applied.grown) {
      return false;
    }
    const freeAtBase = freeSpace + (state.applied.grown - state.applied.base);
    const floor = autoSizeColumn.columnDef.minSize ?? state.applied.base;
    const target = Math.max(floor, state.applied.base + freeAtBase);
    if (Math.abs(target - state.applied.grown) < 1) return false;
    state.applied = { ...state.applied, grown: target };
    table.setColumnSizing((old) => ({
      ...old,
      [state.applied.columnId]: target
    }));
    return true;
  };
  return {
    dispose() {
      clearTimeout(sizingState.settleTimer);
      sizingState.settleTimer = null;
    },
    apply(freeSpace) {
      const table = getTable();
      const state = getDataGridAutoSizeState(table.store);
      const columnSizing =
        table.atoms.columnSizing?.get() ?? table.state.columnSizing;
      if (state.applied && columnSizing[state.applied.columnId] === void 0) {
        state.applied = null;
      }
      const autoSizeColumn = table
        .getVisibleLeafColumns()
        .find(
          (column) => column.columnDef.meta?.autoSize && column.getCanResize()
        );
      if (autoSizeColumn && state.applied?.columnId === autoSizeColumn.id) {
        state.pendingFreeSpace = freeSpace;
        const now = Date.now();
        if (now - state.lastCommitAt > SETTLE_MS) {
          state.lastCommitAt = now;
          return reflow(freeSpace);
        }
        if (state.settleTimer !== null) clearTimeout(state.settleTimer);
        state.settleTimer = setTimeout(() => {
          state.settleTimer = null;
          state.lastCommitAt = Date.now();
          reflow(state.pendingFreeSpace);
        }, SETTLE_MS);
        return false;
      }
      const fillWidth = Math.max(0, freeSpace);
      if (fillWidth <= 0) return false;
      if (!autoSizeColumn) {
        return false;
      }
      const currentSize = columnSizing[autoSizeColumn.id];
      if (currentSize !== void 0 && currentSize !== state.applied?.grown) {
        return false;
      }
      const revert =
        state.applied &&
        columnSizing[state.applied.columnId] === state.applied.grown
          ? state.applied
          : null;
      const base = columnSizing[autoSizeColumn.id] ?? autoSizeColumn.getSize();
      const grown = base + fillWidth;
      state.applied = { columnId: autoSizeColumn.id, base, grown };
      table.setColumnSizing((old) => {
        const next = { ...old, [autoSizeColumn.id]: grown };
        if (revert && next[revert.columnId] === revert.grown) {
          next[revert.columnId] = revert.base;
        }
        return next;
      });
      return true;
    }
  };
}
const DataGridContext = createContext(void 0);
function useDataGrid() {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGrid must be used within a DataGridProvider');
  }
  return context;
}
function DataGridProvider({ children, table, ...props }) {
  setDataGridRowPinningMode(table, !!props.tableLayout?.rowsPinnable);
  const gridId = useId();
  const [viewportWidth, setViewportWidth] = useState(0);
  const columnPinningActive = !!props.tableLayout?.columnsPinnable &&
    (!viewportWidth || canPinTableColumns(table.getStartTotalSize() + table.getEndTotalSize(), viewportWidth));
  const propsRef = useRef(props);
  propsRef.current = props;
  const i18n = mergeDataGridI18n(props.i18n);
  const i18nRef = useRef(i18n);
  i18nRef.current = i18n;
  const tableRef = useRef(table);
  tableRef.current = table;
  const resizeMode =
    props.tableLayout?.columnsResizable && props.tableLayout.columnsResizeMode
      ? props.tableLayout.columnsResizeMode
      : void 0;
  useEffect(() => {
    if (!resizeMode) return;
    if (table.options.columnResizeMode === resizeMode) return;
    table.setOptions((old) => ({ ...old, columnResizeMode: resizeMode }));
  }, [table, resizeMode]);
  const cellSelectionOn = !!props.tableLayout?.cellSelection;
  useEffect(() => {
    if (!cellSelectionOn || table.atoms.cellSelection == null) return;
    if (table.options.autoResetCellSelection === false) return;
    table.setOptions((old) => ({ ...old, autoResetCellSelection: false }));
  }, [table, cellSelectionOn]);
  const pageKey = `${table.state.pagination?.pageIndex}:${table.state.pagination?.pageSize}`;
  const previousPageKeyRef = useRef(pageKey);
  useEffect(() => {
    if (previousPageKeyRef.current === pageKey) return;
    previousPageKeyRef.current = pageKey;
    if (!cellSelectionOn || table.atoms.cellSelection == null) return;
    tableRef.current.resetCellSelection(true);
  }, [pageKey, cellSelectionOn, table.atoms.cellSelection]);
  const autoSize = useMemo(
    () => createDataGridAutoSizeController(() => tableRef.current),
    // A new store must receive a fresh size cache; tableRef follows updates within that store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.store]
  );
  useEffect(() => () => autoSize.dispose(), [autoSize]);
  const tableState = table.state;
  const value = useMemo(
    () => ({
      get props() {
        return propsRef.current;
      },
      get table() {
        return tableRef.current;
      },
      get i18n() {
        return i18nRef.current;
      },
      get recordCount() {
        return propsRef.current.recordCount ?? tableRef.current.getRowCount();
      },
      isLoading: props.isLoading || false,
      gridId,
      columnPinningActive,
      setViewportWidth,
      autoSize
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      autoSize,
      columnPinningActive,
      props.recordCount,
      props.isLoading,
      props.loadingMode,
      props.className,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableLayout),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(props.tableClassNames),
      tableState.sorting,
      tableState.pagination,
      tableState.columnFilters,
      tableState.rowSelection,
      tableState.rowPinning,
      tableState.expanded,
      tableState.grouping,
      tableState.columnVisibility,
      tableState.columnOrder,
      tableState.columnPinning,
      tableState.globalFilter
    ]
  );
  return (
    // One React context serves every TData, but v9 declares both TFeatures and
    // TData invariant, so a `DataGridContextProps<any>` context cannot accept a
    // `DataGridContextProps<TData>` value structurally. The erasure happens
    // here and is undone by the TData generic on each consumer component.
    <DataGridContext.Provider value={value}>
      {children}
    </DataGridContext.Provider>
  );
}
function DataGrid({ children, table, ...props }) {
  const defaultProps = {
    loadingMode: 'skeleton',
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: true,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: true,
      footerBackground: false,
      headerBorder: true,
      width: 'fixed',
      columnsVisibility: false,
      columnsResizable: false,
      // columnsResizeMode has no default on purpose: when unset, the
      // consumer's tanstack columnResizeMode (default "onEnd") is honored.
      columnsPinnable: false,
      columnsGroupable: false,
      columnsMovable: false,
      columnsDraggable: false,
      rowsDraggable: false,
      rowsPinnable: false,
      cellSelection: false,
      cellFillHandle: false
    },
    tableClassNames: {
      base: '',
      header: '',
      headerRow: '',
      // z-40 keeps the sticky header above pinned body cells (zIndex 30 in
      // getPinningStyles), which would otherwise paint over it while
      // scrolling vertically with columnsPinnable enabled.
      headerSticky: 'sticky top-0 z-40 bg-ui-background/90 backdrop-blur-xs',
      body: '',
      bodyRow: '',
      footer: '',
      edgeCell: ''
    }
  };
  const mergedProps = {
    ...defaultProps,
    ...props,
    tableLayout: {
      ...defaultProps.tableLayout,
      ...(props.tableLayout || {})
    },
    tableClassNames: {
      ...defaultProps.tableClassNames,
      ...(props.tableClassNames || {})
    }
  };
  if (!table) {
    throw new Error('DataGrid requires a "table" prop');
  }
  const internalTable = table;
  const internalProps = mergedProps;
  return (
    <DataGridProvider table={internalTable} {...internalProps}>
      {children}
    </DataGridProvider>
  );
}
function DataGridContainer({ children, className }) {
  return (
    <div
      data-slot='data-grid'
      className={cn('relative w-full overflow-hidden', className)}
    >
      {children}
    </div>
  );
}
export { useDataGrid, DataGridProvider, DataGrid, DataGridContainer };

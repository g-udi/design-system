'use client';
import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { mergeDataGridI18n } from './dataGridLabels.jsx';
import { canPinTableColumns } from './dataGridTableModel.js';
import { setDataGridRowPinningMode } from './dataGridRowOrder.js';
import { cn } from '../../../utilities/cn/index.js';
export function getColumnHeaderLabel(column) {
  const meta = column.columnDef.meta;
  if (typeof meta?.headerTitle === 'string') return meta.headerTitle;
  const defHeader = column.columnDef.header;
  if (typeof defHeader === 'string') return defHeader;
  return String(column.id);
}
export function getDataGridCellSelectionCellAttrs(cell) {
  const selected = cell.getIsSelected();
  const edges = cell.getSelectionEdges();
  return {
    'aria-selected': selected,
    'data-col-id': cell.column.id,
    'data-cell-selected': selected || void 0,
    'data-cell-focused': cell.getIsFocused() || void 0,
    'data-cell-edge-top': edges.top || void 0,
    'data-cell-edge-right': edges.right || void 0,
    'data-cell-edge-bottom': edges.bottom || void 0,
    'data-cell-edge-left': edges.left || void 0
  };
}
export const dataGridCellSelectionCellClasses = cn(
  'relative select-none',
  // A light tint: the selection must read as a range without drowning the
  // gridlines under a heavy fill. The focused cell stays unfilled. Pinned
  // cells must stay OPAQUE (they hide scrolled content), so they get the
  // tint pre-mixed over the background, and the focused pinned cell keeps
  // a solid background instead of turning transparent.
  'data-[cell-selected]:bg-ui-primary/4',
  'data-[cell-selected]:data-pinned:bg-[color-mix(in_oklab,var(--primary)_4%,var(--background))]',
  'data-[cell-focused]:bg-transparent!',
  'data-[cell-focused]:data-pinned:bg-ui-background!',
  // Every selection line is one layout-free ::before overlay per cell. It
  // reaches 1px BEYOND the cell so each line paints exactly ON the shared
  // gridline it replaces: the range perimeter and the interior dividers
  // share this geometry, so where they meet they coincide instead of
  // stacking into a wider edge, every side stays exactly 1px, and
  // selecting never adds real borders that shift layout. At the table's
  // own boundary there is no shared gridline and the overshoot leaves the
  // scrollable content box, where it is CLIPPED - the perimeter simply
  // vanished on the first column, last column and last row. So every
  // overshoot that can hit a boundary goes through a variable the
  // boundary cells zero out. Longhand inset utilities only, logical
  // start/end
  // so RTL mirrors for free; a separate override rule cannot do this,
  // equal-specificity variants leave shorthand-vs-longhand to sort order.
  "data-[cell-selected]:before:pointer-events-none data-[cell-selected]:before:absolute data-[cell-selected]:before:top-[var(--data-grid-overlay-top,-1px)] data-[cell-selected]:before:start-[var(--data-grid-overlay-start,-1px)] data-[cell-selected]:before:end-[var(--data-grid-overlay-end,-1px)] data-[cell-selected]:before:bottom-[var(--data-grid-overlay-bottom,-1px)] data-[cell-selected]:before:border-ui-primary data-[cell-selected]:before:content-['']",
  "data-[cell-focused]:before:pointer-events-none data-[cell-focused]:before:absolute data-[cell-focused]:before:top-[var(--data-grid-overlay-top,-1px)] data-[cell-focused]:before:start-[var(--data-grid-overlay-start,-1px)] data-[cell-focused]:before:end-[var(--data-grid-overlay-end,-1px)] data-[cell-focused]:before:bottom-[var(--data-grid-overlay-bottom,-1px)] data-[cell-focused]:before:border-ui-primary data-[cell-focused]:before:content-['']",
  // Interior dividers: selected cells repaint their own end and bottom
  // gridlines on the overlay, so gridline-less grids still divide a range.
  // The gray color is guarded by not- variants (higher specificity), so a
  // side that belongs to the range perimeter deterministically stays
  // primary.
  'data-[cell-selected]:before:border-e data-[cell-selected]:before:border-b',
  'data-[cell-selected]:not-data-[cell-edge-right]:before:border-e-border',
  'data-[cell-selected]:not-data-[cell-edge-bottom]:before:border-b-border',
  // The Sheets model: a single selected cell IS its own range, so the four
  // edge attributes below already draw its full primary box; inside a
  // larger range the anchor reads by its unfilled background alone. The
  // explicit ring only covers a focused cell with no selection at all.
  // Edge sides are logical (border-e/border-s): the feature derives edges
  // from display-order column indexes, which mirror in RTL.
  'data-[cell-focused]:not-data-[cell-selected]:before:border',
  'data-[cell-edge-top]:before:border-t data-[cell-edge-right]:before:border-e data-[cell-edge-bottom]:before:border-b data-[cell-edge-left]:before:border-s',
  // While a fill drag is live the preview border is the ONE painter for
  // the whole pending region, so the source cells' own chrome rests -
  // otherwise its lines double against the region border at every shared
  // edge. display is the no-cascade-fight switch (see below).
  'in-data-[cell-filling]:data-[cell-selected]:before:hidden',
  'in-data-[cell-filling]:data-[cell-focused]:before:hidden',
  // While the built-in editor is open its outline is the one border; the
  // edited cell's own overlay chrome hides so nothing peeks around the
  // flush editor. display is the switch because no other before: rule
  // sets it, so there is no cascade order to lose.
  'in-data-[cell-editing]:data-[cell-focused]:before:hidden',
  // Clamped to the cell edge at the grid's own boundary, the overlay's
  // lines sit flush against the container border instead of being clipped
  // away outside the scrollable content. A custom property has no cascade
  // fight to lose. First/last-child cover the boundary columns: when a
  // filler td follows the last data column, that cell's overshoot lands
  // INSIDE the table and needs no clamp, and the td:first/last-child of a
  // row are its logical start/end in RTL too.
  'in-[tr:last-child]:[--data-grid-overlay-bottom:0px]',
  // The top overshoot lands under a sticky header, which is positioned and
  // paints over it - so the first row's perimeter lost its top line. Clamp
  // inside the cell there, exactly like the other three boundaries.
  'in-[tr:first-child]:[--data-grid-overlay-top:0px]',
  'first:[--data-grid-overlay-start:0px]',
  'last:[--data-grid-overlay-end:0px]',
  // A pinned column is a boundary like the grid's own edges: the sticky
  // neighbor would cover an on-gridline overlay line, and re-painting it
  // from the pinned side doubles into a 2px blur whenever subpixel
  // positions disagree (browser zoom, fractional fill widths). One
  // painter instead: the overlay clamps inside its own cell there, the
  // same custom-property clamp the first and last cells use.
  '[&:has(+td[data-pinned])]:[--data-grid-overlay-end:0px]',
  '[&:has(+[data-slot=data-grid-table-fill-body-cell]:last-child)]:[--data-grid-overlay-end:0px]',
  '[&:has(+[data-slot=data-grid-table-fill-body-cell]+td[data-pinned])]:[--data-grid-overlay-end:0px]',
  '[td[data-pinned]+&]:[--data-grid-overlay-start:0px]',
  // Tint only: the dashed region outline is one overlay element drawn by
  // the fill session, so neighboring target cells never double their edges.
  'data-[cell-fill-target]:bg-ui-primary/4',
  'data-[cell-fill-target]:data-pinned:bg-[color-mix(in_oklab,var(--primary)_4%,var(--background))]'
);
export function toDataGridDomId(value) {
  return value.replace(/[^\w-]/g, '_');
}
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
export { dataGridFeatures } from './dataGridFeatures.js';

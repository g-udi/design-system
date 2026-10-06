import { table_extendCellSelection, table_moveCellSelection } from '@tanstack/react-table/static-functions';
import { getDataGridTableResolvedRows } from './dataGridTableModel.js';

const rowOrders = new WeakMap();

// TanStack 9's display order and keyboard step model omit row pinning. Keep
// its selection engine, but give it the same row order that Gaudi renders.
export const dataGridRowOrderFeature = {
  constructTableAPIs(table) {
    const nativeRows = table.getRowsInDisplayOrder;
    const nativeMove = table.moveCellSelection;
    const nativeExtend = table.extendCellSelection;
    const state = { enabled: false, rows: null, indices: new Map() };
    rowOrders.set(table.store, state);
    table.getRowsInDisplayOrder = () => {
      const rows = nativeRows();
      if (!state.enabled) return rows;
      const top = table.getTopRows();
      const bottom = table.getBottomRows();
      if (rows !== state.nativeRows || top !== state.top || bottom !== state.bottom) {
        const pinnedIds = new Set([...top, ...bottom].map((row) => row.id));
        state.rows = [...top, ...rows.filter((row) => !pinnedIds.has(row.id)), ...bottom];
        state.indices = new Map(state.rows.map((row, index) => [row.id, index]));
        state.nativeRows = rows;
        state.top = top;
        state.bottom = bottom;
      }
      return state.rows;
    };
    // Preserve the current page and virtual row model. Only keyboard stepping
    // needs the rendered top/center/bottom order instead of the raw page order.
    const selectionTable = Object.create(table);
    selectionTable.getRowModel = () => ({
      ...table.getRowModel(),
      rows: getDataGridTableResolvedRows(table, true).map(({ row }) => row)
    });
    table.moveCellSelection = (direction) => state.enabled
      ? table_moveCellSelection(selectionTable, direction)
      : nativeMove(direction);
    table.extendCellSelection = (direction) => state.enabled
      ? table_extendCellSelection(selectionTable, direction)
      : nativeExtend(direction);
  },
  assignRowPrototype(prototype, table) {
    const nativeIndex = prototype.getDisplayIndex;
    prototype.getDisplayIndex = function () {
      const state = rowOrders.get(table.store);
      if (!state?.enabled) return nativeIndex.call(this);
      table.getRowsInDisplayOrder();
      return state.indices.get(this.id) ?? -1;
    };
  }
};

export function setDataGridRowPinningMode(table, enabled) {
  const state = rowOrders.get(table.store);
  if (state) state.enabled = enabled;
}

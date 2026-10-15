'use client';
import { useEffect, useReducer } from 'react';
import { useDataGrid } from './DataGrid.jsx';
import { DATA_GRID_VIEW_LABELS } from './dataGridViewModel.js';
export function useDataGridViewLabels(overrides) {
  const { i18n } = useDataGrid();
  return { ...DATA_GRID_VIEW_LABELS, ...i18n.labels, ...overrides };
}
/**
 * Re-renders on every table store change. The DataGrid context does not track
 * column sizing (it would re-render every cell mid-resize), so view parts that
 * compare layouts subscribe themselves instead of relying on the host.
 */
export function useDataGridStoreVersion(table) {
  const [version, bump] = useReducer((count) => count + 1, 0);
  const store = table?.store;
  useEffect(() => {
    if (!store?.subscribe) return void 0;
    const subscription = store.subscribe(() => bump());
    return () => {
      if (typeof subscription === 'function') subscription();
      else subscription?.unsubscribe?.();
    };
  }, [store]);
  return version;
}

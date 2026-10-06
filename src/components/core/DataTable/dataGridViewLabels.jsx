'use client';
import { useEffect, useReducer } from 'react';
import { useDataGrid } from './DataGrid.jsx';
// The view controls keep their copy here rather than in the shared label map:
// `mergeDataGridI18n` already passes unknown override keys through, so a host
// translates these exactly like the built-in labels (`i18n={{ labels }}`).
export const DATA_GRID_VIEW_LABELS = Object.freeze({
  viewOptions: 'View',
  viewOptionsTitle: 'View settings',
  density: 'Density',
  densityComfortable: 'Comfortable',
  densityCompact: 'Compact',
  displaySection: 'Display',
  stickyHeader: 'Sticky header',
  columnsSection: 'Columns',
  showAllColumns: 'Show all',
  moveColumnUp: (title) => `Move ${title} up`,
  moveColumnDown: (title) => `Move ${title} down`,
  columnMoved: (title, position, total) =>
    `${title} moved to position ${position} of ${total}`,
  columnPinned: 'Pinned',
  viewMode: 'Layout',
  tableView: 'Table',
  cardView: 'Cards',
  selectCard: (title) => `Select ${title}`,
  pinnedCard: 'Pinned',
  layouts: 'Layouts',
  layoutsTitle: 'Saved layouts',
  layoutName: 'Layout name',
  layoutNamePlaceholder: 'Name this layout',
  saveLayout: 'Save',
  applyLayout: (name) => `Apply ${name}`,
  deleteLayout: (name) => `Delete ${name}`,
  layoutsEmpty: 'No saved layouts yet.',
  layoutModified: 'Modified',
  layoutSaved: (name) => `Saved layout ${name}`,
  layoutApplied: (name) => `Applied layout ${name}`,
  layoutDeleted: (name) => `Deleted layout ${name}`,
  layoutReset: 'Layout reset',
  resetLayout: 'Reset layout',
  defaultLayout: 'Default',
  customLayout: 'Custom',
  columnStats: 'Column stats',
  statCount: 'Count',
  statDistinct: 'Distinct',
  statEmpty: 'Empty',
  statMin: 'Min',
  statMax: 'Max',
  statAvg: 'Average',
  statSum: 'Sum',
  copyStat: (label) => `Copy ${label.toLowerCase()}`,
  addColumn: 'Add column',
  addColumnSearch: 'Search columns...',
  columnAdded: (title) => `Added ${title} column`,
  statusTabs: 'Status',
  statusAll: 'All',
  statusCount: (label, count) => `${label}, ${count}`
});
export function resolveDataGridViewLabels(labels) {
  return { ...DATA_GRID_VIEW_LABELS, ...labels };
}
export function useDataGridViewLabels(overrides) {
  const { i18n } = useDataGrid();
  return { ...DATA_GRID_VIEW_LABELS, ...i18n.labels, ...overrides };
}
/** Reads one table state slice from its atom, falling back to the store snapshot. */
export function readDataGridState(table, key) {
  return (
    table.atoms?.[key]?.get?.() ?? table.store?.state?.[key] ?? table.state?.[key]
  );
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

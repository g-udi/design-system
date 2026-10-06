const DEFAULT_DATA_GRID_LABELS = {
  sortAscending: 'Asc',
  sortDescending: 'Desc',
  pinColumnStart: 'Pin to left',
  pinColumnEnd: 'Pin to right',
  moveColumnStart: 'Move to left',
  moveColumnEnd: 'Move to right',
  columnsMenu: 'Columns',
  unpinColumn: (title) => `Unpin ${title} column`,
  toggleColumns: 'Toggle Columns',
  rowCreate: 'Add row',
  pinRow: 'Pin row',
  unpinRow: 'Unpin row',
  selectRow: 'Select row',
  selectAll: 'Select all',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  dragToReorder: 'Drag to reorder',
  dragToReorderRow: 'Drag to reorder row',
  reorderingUnavailable: 'Reordering unavailable',
  loading: 'Loading...',
  empty: 'No data available',
  allRowsLoaded: 'All records loaded',
  rowsPerPage: 'Rows per page',
  paginationInfo: ({ from, to, count }) => `${from} - ${to} of ${count}`,
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  pageOf: 'of',
  pageShortcuts: 'Page shortcuts',
  goToPage: (page) => `Go to page ${page}`,
  paginationEllipsis: '...',
  filterSelectedCount: (count) => `${count} selected`,
  filterNoResults: 'No results found.',
  filterClear: 'Clear filters',
  groupByColumn: 'Group by this column',
  ungroupColumn: 'Stop grouping',
  expandGroup: (value) => `Expand ${value}`,
  collapseGroup: (value) => `Collapse ${value}`,
  groupRowCount: (count) => `${count} ${count === 1 ? 'row' : 'rows'}`,
  exportCsv: 'Export CSV',
  exported: (count) => `Exported ${count} ${count === 1 ? 'row' : 'rows'}`
};
const DEFAULT_DATA_GRID_I18N = Object.freeze({
  labels: Object.freeze(DEFAULT_DATA_GRID_LABELS)
});
export function mergeDataGridI18n(overrides) {
  if (!overrides?.labels) return DEFAULT_DATA_GRID_I18N;
  return {
    labels: { ...DEFAULT_DATA_GRID_LABELS, ...overrides.labels }
  };
}

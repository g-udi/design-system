import { dataGridRowOrderFeature } from './dataGridRowOrder.js';
import {
  aggregationFns,
  cellSelectionFeature,
  columnFacetingFeature,
  columnGroupingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  filterFn_includesString,
  metaHelper,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
  tableFeatures
} from '@tanstack/react-table';
export const dataGridFeatures = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  // columnResizingFeature requires columnSizingFeature, declared above.
  columnResizingFeature,
  columnFilteringFeature,
  // Powers DataGridColumnFilter's column.getFacetedUniqueValues(). On v8 an
  // unregistered facet silently returned an empty map; on v9 the method would
  // not exist at all, so the faceted row models below are required, not
  // optional.
  columnFacetingFeature,
  // globalFilteringFeature requires columnFilteringFeature, declared above.
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowPinningFeature,
  // Registration alone is inert: it seeds a `cellSelection: []` slice and
  // prototype methods but binds no DOM handlers, so grids without
  // `tableLayout.cellSelection` render and behave exactly as before.
  cellSelectionFeature,
  // Grouping is inert until `grouping` state names a column; grouped rows then
  // carry aggregated values from each column's `aggregationFn`, and the same
  // registry powers `column.getAggregationValue()` for footer totals.
  columnGroupingFeature,
  rowAggregationFeature,
  dataGridRowOrderFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  // Every built-in v9 ships. A string `sortFn` resolves against this map
  // alone, and `sortFn: "auto"` infers a name ("alphanumeric", "text" or
  // "datetime") from the first row's value - so a partial map makes auto
  // sorting warn and silently fall back on ordinary string columns.
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
    textCaseSensitive: sortFn_textCaseSensitive
  },
  columnMeta: metaHelper()
});

# DataTable

A table for client collections up to a few thousand rows: search with a live count, single or multi-column sorting,
round row selection, column visibility, paging or load-more, grouped and expandable rows, row actions, pinned rows and
columns, sticky headers, automatic virtualization, CSV export, a totals footer, and loading, refreshing, empty and error
states. It is built on TanStack Table and composes the DS Button, Input, Checkbox, DropdownMenu, Skeleton, Spinner and
EmptyState.

```jsx
import DataTable from '@gaudi/design-system/core/DataTable';

<DataTable
  caption='Article library'
  columns={[{ key: 'title', header: 'Article' }, { key: 'words', header: 'Words', align: 'right' }]}
  rows={articles}
  searchable
  sortable
  selectable
  pagination
  pageSize={10}
  density='compact'
/>
```

- Columns take `key`, `header`, `render`, `accessor`, `align`, `width`, `sticky` (`left` or `right`), `footer`,
  `exportValue(value, row)` and `export: false`, and `sortable`, `searchable` or `hideable` set to `false` to opt out.
- State is controlled or uncontrolled: `sorting` / `defaultSorting` / `onSortingChange`, `selection` /
  `defaultSelection` / `onSelectionChange`, `expanded` / `defaultExpanded` / `onExpandedChange` (row IDs) and
  `rowPinning` / `defaultRowPinning` / `onRowPinningChange` (`{ top, bottom }`). A controlled host can refuse a change by
  not applying it, or replace it with something else.
- `multiSort` adds Shift-click sorting by more than one column; headers show their sort order.
- `pinnableRows` adds Pin to top, Pin to bottom and Unpin to each row menu. Pinned rows stay in view through sorting,
  search and pages, and stick under the header while the region scrolls; they stop sticking when the bands would
  crowd out the scrolling rows.
- `getRowActions` opens one menu from the overflow button, a right-click, Shift+F10 or the Menu key, and returns focus to
  where it was. `canActivateRow(row)` leaves some rows inert while `onRowClick` activates the rest.
- `maxHeight` scrolls rows inside the region with a sticky header. `stickyHeader='page'` keeps the header under page
  chrome (`stickyOffset`) while the page scrolls; in that mode the table fits its container, and a table too wide
  for it falls back to scrolling sideways in place.
- `virtualize='auto'` (the default) renders only the rows in view above `virtualThreshold` rows (100) and gives the
  region a 32rem height unless `maxHeight` is set. Grouped and paged tables are not virtualized.
- `onLoadMore`, `hasMore` and `loadingMore` add a Load more action; `loadMoreOnScroll` asks for the next batch as the last
  row comes into view.
- `exportable` (or `{ filename, scope, label, delimiter, onExport }`) adds Export CSV: visible columns, the current
  search and sort, and only the selected rows when there is a selection. Formula-like text is neutralised so spreadsheets
  show it as text.
- Filtering predicates, remote fetching and persistence stay in the host; pair it with `FilterBar` for facets.

## DataGrid parts

Use the `DataGrid` parts (`DataGrid`, `DataGridContainer`, `DataGridTable`, `DataGridPagination`, …) for resizable,
draggable, virtualised, editable or server-driven grids.

- **Grouping and aggregation.** `dataGridFeatures` registers grouping and aggregation. Set `grouping` state (or turn on
  `tableLayout.columnsGroupable` for a "Group by this column" header action) and give columns an `aggregationFn`:
  `sum`, `count`, `mean`, `min`, `max`, `extent`, `median`, `unique`, `uniqueCount`, `first`, `last`, or a custom
  `constructAggregationFn({ aggregate })`. Group bands collapse, count their records and render aggregates with the
  column's `aggregatedCell` (or a formatted value). `column.getAggregationValue()` returns grand totals for a footer.
- **Export.** `DataGridExport` saves the grid's visible columns, filters, sort and selection as CSV; `meta.exportValue`
  formats a cell and `meta.export: false` skips control columns. `toCsv`, `tableToCsv` and `downloadCsv` are exported for
  custom flows.

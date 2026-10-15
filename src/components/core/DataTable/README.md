# DataTable

A table for client collections up to a few thousand rows: search with a live count, single or multi-column sorting,
row selection, column visibility, paging or load-more, grouped and expandable rows, row actions, pinned rows and
columns, sticky headers, automatic virtualization, CSV export, a totals footer, and loading, refreshing, empty and error
states. The convenience table and DataGrid share TanStack Table v9 and the same feature registry. It composes the DS Button, Input, Checkbox, DropdownMenu, Skeleton, Loader and
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

- Columns take `key`, `header`, `render`, `accessor`, `align`, `width`, `sticky` (`start` or `end`; `left` and `right` are aliases that mirror in RTL), `footer`,
  `exportValue(value, row)` and `export: false`, and `sortable`, `searchable` or `hideable` set to `false` to opt out.
- Text follows the surrounding reading direction by default. Set `align` to `left`, `center`, or `right` for an explicit physical alignment.
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

## Shared table appearance

The primitive Table, DataTable, DataGrid and article Table use the same header typography and semantic colours. Labels preserve supplied casing. Density changes padding and header height, not typography or colour.

`DataTable` uses `headerVariant='muted'` by default; choose `'plain'` for a surface-coloured header. DataGrid uses the same default through `tableLayout.headerBackground=true`; setting it to `false` selects the plain treatment. Its `dense` flag maps to the shared compact density. Both treatments keep an opaque background for sticky headers.

## DataGrid parts

Use the `DataGrid` parts (`DataGrid`, `DataGridContainer`, `DataGridTable`, `DataGridPagination`, …) for resizable,
draggable, virtualised, editable or server-driven grids.

- **Grouping and aggregation.** `dataGridFeatures` registers grouping and aggregation. Set `grouping` state (or turn on
  `tableLayout.columnsGroupable` for a "Group by this column" header action) and give columns an `aggregationFn`:
  `sum`, `count`, `mean`, `min`, `max`, `extent`, `median`, `unique`, `uniqueCount`, `first`, `last`, or a custom
  `constructAggregationFn({ aggregate })`. Group bands collapse, count their records and render aggregates with the
  column's `aggregatedCell` (or a formatted value). `column.getAggregationValue()` returns grand totals for a footer.
- **Narrow containers.** DataTable and DataGrid release fixed column positioning when pinned columns would use at least three quarters of the scroll viewport. The host’s pinning state and column order stay intact; pinning resumes when the container grows.
- **Editing.** With `tableLayout.cellSelection`, a column edits through `meta.cellEdit`:
  - `control`: `text`, `textarea`, `number`, `select`, `combobox`, `date`, `checkbox` or `switch`. Enter, F2, typing or a
    double-click opens the editor over the cell (the Gaudi Select, Combobox, Calendar); checkbox and switch cells flip with
    Enter, Space or a click and render with `DataGridCellToggle`. `options` (`[{ value, label }]`, strings or
    `(row) => options`) feed select and combobox; `step`, `min` and `max` the number editor (ArrowUp/Down steps, Shift
    by ten); dates are stored as `yyyy-MM-dd` and shown with `displayFormat` (`MMM d, yyyy`).
  - Each built-in control brings a `parse(raw, row)` and `format(value, row)` pair, so paste, fill and clipboard copy
    read the same values the editors write. A column's own `parse`, `format`, `clearValue` or `setValue(row, value)`
    wins.
  - `required`, `min`, `max` and `validate(value, row)` (a message string, `false`, or nothing when valid) mark a cell
    invalid. The grid shows the error inline through `getCellError(row, columnId)`: the cell sets `aria-invalid`,
    points `aria-describedby` at its message, tints red and shows a tooltip while hovered or focused.
- **Undo and redo.** `useDataGridHistory({ onApply, limit })` records each `onCellsChange` batch (an edit, paste, fill,
  clear or cut) as one step and replays its inverse through `invertDataGridCellsChange`; `record({ undo, redo, source })`
  adds custom steps. Pass `gridProps` (`onCellsChange`, `onUndo`, `onRedo`) to `DataGrid` for Mod+Z, Shift+Mod+Z and
  Ctrl+Y, and `DataGridHistoryControls history={…}` adds toolbar buttons with their shortcuts.
- **Pending changes.** `useDataGridEditing({ data, columns, getRowId, onSave, onReject })` keeps a working copy of
  `data`: give the table `editing.rows` and spread `editing.gridProps` onto `DataGrid` for dirty, new and invalid
  status, inline errors and history. `insertRow`, `duplicateRow(rowId, copy)` and `removeRows(ids)` are undoable;
  `pending`, `pendingCount`, `errors` and `firstError` describe the state, `save()` calls `onSave({ rows, updated,
  added, removed })` (return `false` or throw to keep the changes) and `discard()` reverts everything. Text that cannot
  be parsed stays visible as a cell error instead of a toast. `DataGridSaveBar editing={…} apiRef={…}` shows the count,
  the cells that need attention (Show focuses the first) and Discard and Save; Save is blocked while errors exist. It
  floats at the bottom like `DataGridSelectionBar`; to show both, wrap them in one sticky row and pass
  `className='static mx-0'` to each.
- **Per-row edit mode.** `useDataGridRowEditing({ columns, onSave, onCancel })` turns one row at a time into a draft:
  spread its `gridProps` onto `DataGrid` and render `DataGridRowEditActions row={row} label={name}` in an actions column.
  Editable cells of the draft render `DataGridCellInlineEditor`; Enter saves, Escape cancels, other rows stay
  read-only (spreadsheet edits pause too), and messages appear once a field is touched or after a save attempt.
  `start(row, { isNew: true })` opens a new row; `onCancel({ rowId, isNew })` lets the host remove it again.
- **Labels.** The editing parts read `undo`, `redo`, `unsavedChanges(count)`, `invalidCells(count)`, `showInvalidCell`,
  `saveBlocked`, `save`, `saving`, `discard`, `editRow(name)`, `saveRow` and `cancelRowEdit` from `i18n.labels`.
- **Lazy children.** `useDataGridLazyRows({ data, expanded, getRowHasChildren, loadChildren, onChildrenLoad })`
  loads a parent's children the first time it opens. Spread its `tableOptions` into `useTable` and pass the hook to
  `<DataGrid lazyRows={lazy}>`: the table shows a skeleton row under a pending parent and an error row with Retry when
  the promise rejects. Results are cached (`invalidate(id)` drops one); `onChildrenLoad` merges them into host data,
  which always wins over the cache. Mark the tree column with `meta.treeColumn` so status rows line up with it.
- **Tree drag and drop.** `DataGridTableTreeDnd` is a body whose rows drop before, after or into another row
  (`canDropInside(row)`, default: rows that can expand), drawn with the Tree's drop line. A row never drops into
  itself or its descendants, a closed folder opens after a short hover, and reordering pauses while the grid is sorted.
  `DataGridTableTreeDndHandle` is the grip; Enter or Space on it starts a keyboard move (arrow keys choose the place,
  Enter drops, Escape cancels), announced through a status region.
- **Row moves.** Drag and drop, the keyboard and `DataGridTableRowMoveItems` (Move up, Move down, Move to top, Move to
  bottom for a row menu) all report through `<DataGrid onRowMove>` with `{ id, parentId, index, targetId, position }`.
  `moveDataGridRow(data, move, { childrenKey })` applies a move to nested or flat data. Alt+Arrow and Alt+Home/End on
  either drag handle move the focused row among its siblings. `useDataGridRowOrder(rows)` keeps a flat manual order with
  `moveRow`, `handleDragEnd`, `reset` and `isReordered`. Pass an `emptyMessage` node for the DnD body's empty state.
- **Tree selection.** `DataGridTableTreeRowSelect` and `DataGridTableTreeRowSelectAll` cascade: checking a parent
  checks every descendant, a parent reads checked when all of its children are and mixed when some are, and children
  that load under a checked parent arrive checked. `DataGridSelectionBar` counts every selected row at any depth.
- **Rollups.** Give a column `meta.rollup: true` and an `aggregationFn`: tree parents show the aggregate of their
  deepest loaded descendants (an unloaded parent keeps its own value), formatted by `meta.rollupCell({ value, row,
  scope })`. `DataGridTableTreeTotals` adds a grand-total footer row; `getDataGridRollupValue` and
  `getDataGridTreeTotal` return the numbers. `DataGridTreeExpand` offers Expand all, Collapse all and Expand to level N
  (pass `levels` when deeper levels have not loaded yet).
- **Banded sections.** `DataGridTableSections` renders a grouped grid as one section per group: a tinted band with the
  title, a count, a collapse toggle, `selectable` select-all for the section and an optional `onSectionAdd` action,
  followed by its own column headers. Sort, selection and columns stay shared, sections scroll sideways together, and
  `sections={[{ value, label, tone, description }]}` orders the bands and keeps empty ones visible. Tones are
  `neutral`, `accent`, `info`, `success`, `warning`, `danger`, `attention` and `discovery`. Hide the grouped column
  (`columnVisibility`) and set `groupedColumnMode: false`; `DataGridTableSectionSelectAll` and `useDataGridSection()`
  work inside a section's headers and cells.
- **Export.** `DataGridExport` saves the grid's visible columns, filters, sort and selection as CSV; `meta.exportValue`
  formats a cell and `meta.export: false` skips control columns. `toCsv`, `tableToCsv` and `downloadCsv` are exported for
  custom flows.

### View controls

```jsx
import {
  DataGrid, DataGridCardView, DataGridColumnPicker, DataGridLayouts, DataGridStatusTabs, DataGridTable,
  DataGridViewOptions, DataGridViewToggle, createDataGridColumnRegistry, dataGridEqualsFilter, useDataGridLayouts
} from '@gaudi/design-system/core/DataTable';

const layouts = useDataGridLayouts({ table, density, onDensityChange: setDensity, storageKey: 'deals-layouts' });

<DataGrid table={table} recordCount={rows.length} tableLayout={{ dense: density === 'compact', headerSticky, rowsPinnable: true }}>
  <DataGridColumnPicker registry={registry} value={addedIds} onAdd={(id) => setAddedIds((ids) => [...ids, id])} />
  <DataGridLayouts layouts={layouts} />
  <DataGridViewOptions density={density} onDensityChange={setDensity} headerSticky={headerSticky}
    onHeaderStickyChange={setHeaderSticky} onReset={layouts.resetLayout} />
  <DataGridViewToggle value={view} onValueChange={setView} />
  <DataGridStatusTabs columnId='stage' options={stages}>
    {view === 'table' ? <DataGridTable /> : <DataGridCardView aria-label='Deals' />}
  </DataGridStatusTabs>
</DataGrid>
```

- **View settings.** `DataGridViewOptions` is one popover for density (`density` / `onDensityChange`, `comfortable` or
  `compact`), the sticky header (`headerSticky` / `onHeaderStickyChange`), extra `toggles` (`{ id, label, checked,
  onCheckedChange, description? }`) and the column list: a checkbox per hideable column plus Move up and Move down
  (or Alt+Arrow keys), with pinned columns held in place. `onReset` adds Reset layout. Pass `children` to compose
  `DataGridViewOptionsSection`, `DataGridViewOptionsDensity`, `DataGridViewOptionsSwitch` and
  `DataGridViewOptionsColumns` yourself. `getDataGridColumnOrder(table)` and `moveDataGridColumn(table, id, delta)` are
  the ordering helpers.
- **Table or cards.** `DataGridCardView` renders the same row model as the table (sorting, filters, pagination, pinned
  rows first) as a responsive card grid (`minCardWidth`, default `16rem`), and selection is shared. Columns choose
  their card slot with `meta.card`: `title`, `subtitle`, `media`, `badge`, `actions`, `field` or `false`
  (`meta.cardLabel` renames a field). `renderCard({ row, slots, table, isSelected })` replaces the default card.
  `DataGridViewToggle` switches `'table'` and `'cards'`.
- **Saved layouts.** `useDataGridLayouts({ table, density?, onDensityChange?, defaultLayout?, layouts?,
  defaultLayouts?, onLayoutsChange?, storageKey? })` snapshots column order, sizing, visibility and pinning (and
  density when `onDensityChange` is given) into named layouts `{ id, name, layout }`. Saved layouts are controlled or
  uncontrolled; `storageKey` also keeps them and the current layout in localStorage, restored after hydration. It
  returns `layouts`, `activeLayout`, `isDefault`, `saveLayout(name)`, `applyLayout(id)`, `deleteLayout(id)` and
  `resetLayout()` (back to `defaultLayout`, else the table's initial state). `DataGridLayouts` is the menu for it;
  `getDataGridLayout`, `applyDataGridLayout` and `isSameDataGridLayout` work on any table.
- **Column stats.** A header with `stats` (or a column with `meta.stats`) adds a labelled Column stats group to its menu:
  count, distinct and empty values, and min, max, average and sum for numbers (min and max for dates), over the
  filtered rows. Each stat is a menu item that copies its value; `DataGridColumnStats` renders the same figures as a
  definition list outside menus. Pass an array
  (`['min', 'max', 'avg']`) to pick stats and `meta.statsFormat(value, id)` to format them. `getDataGridColumnStats`
  reads the column's own `getAggregationValue` first, so a server-backed aggregation supplies its values.
- **Add columns.** `createDataGridColumnRegistry(entries)` groups addable columns (`{ id, label, icon?, keywords?,
  children?, column }`) for `DataGridColumnPicker`, a searchable Cascader that disables columns already shown. The host
  keeps the added ids and builds `columns` with `registry.getColumns(ids)`.
- **Heat cells.** `DataGridHeatmapCell` colours a number with the HeatmapChart scale and chart tokens (`heatmap`, or
  `diverging` around `midpoint`), against its column's visible range or a given `domain`;
  `getDataGridHeatmapColor` returns the fill and ink for custom cells. For trend cells, lazy-load
  `Sparkline` from `@gaudi/design-system/charts` so the chart runtime stays out of the table's bundle.
- **Status tabs.** `DataGridStatusTabs` puts an All tab and one tab per status, each with a live count, above the grid,
  which renders as the tab panel. With `columnId` a tab filters that column (give it `filterFn: dataGridEqualsFilter`)
  and counts come from its facets, which ignore the column's own filter; otherwise pass `value`, `onValueChange` and
  `counts`.
- **Virtualized selection.** Under `DataGridTableVirtual` with `onFetchMore` and `manualPagination`, Select all takes
  every loaded row and reads as partial when the next page arrives. For "every matching record", keep a flag in the
  host and derive the selection from it, as the Shipment exceptions example does; bulk actions then target the query,
  not only loaded rows.

Every string is in `DATA_GRID_VIEW_LABELS` and translates through the grid's `i18n.labels`. The view popovers are
labelled dialogs that return focus to their trigger; column moves keep focus on the moved row and are announced, and
layout, column and export changes are announced through status regions.

## Implementation ownership

`dataGridFeatures.js` owns engine registration for both APIs. Clipboard serialization and selection models stay separate from DOM fill sessions and editor overlays. Table headers, rows, controls, resizing and framing live in `components/`; public exports remain in `index.js`. Constants and helpers live in server-safe modules (`dataGridModel.js`, `dataGridStructureModel.js`, `dataGridViewModel.js`, `dataGridColumnStats.js`, `dataGridCellContent.js` and the selection, clipboard and table models) and `index.js` re-exports them from there, never through a `'use client'` file, so server components receive values rather than client references. The convenience API retains `sortingFn` column callbacks and adapts them to the shared engine.

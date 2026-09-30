# DataTable

A table for client collections up to a few hundred rows: search with a live count, sortable headers, round row
selection, column visibility, paging, grouped and expandable rows, row actions, pinned columns, a totals footer, and
loading, refreshing, empty and error states. It is built on TanStack Table and composes the DS Button, Input, Checkbox,
DropdownMenu, Skeleton, Spinner and EmptyState.

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

- Columns take `key`, `header`, `render`, `accessor`, `align`, `width`, `sticky` (`left` or `right`), `footer`, and
  `sortable`, `searchable` or `hideable` set to `false` to opt out.
- `selection` with `onSelectionChange` controls selection; `renderSelectionActions` fills the toolbar while rows are selected.
- Filtering predicates, remote fetching and persistence stay in the host; pair it with `FilterBar` for facets.
- Use the `DataGrid` parts (`DataGrid`, `DataGridContainer`, `DataGridTable`, `DataGridPagination`, …) for resizable,
  draggable, virtualised, editable or server-driven grids.

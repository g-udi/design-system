/* Server-safe view-control helpers: labels, column order, layouts, card slots,
 the column registry and status counts. Client parts import them; public
 entries re-export them from here. */

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
/** Reads one table state slice from its atom, falling back to the store snapshot. */
export function readDataGridState(table, key) {
  return (
    table.atoms?.[key]?.get?.() ?? table.store?.state?.[key] ?? table.state?.[key]
  );
}

/**
 * The full leaf order the grid renders: the `columnOrder` state first, then
 * every leaf it does not name, which is where TanStack places them too.
 */
export function getDataGridColumnOrder(table) {
  const leafIds = table.getAllLeafColumns().map((column) => column.id);
  const ordered = (readDataGridState(table, 'columnOrder') ?? []).filter(
    (id) => leafIds.includes(id)
  );
  return [...ordered, ...leafIds.filter((id) => !ordered.includes(id))];
}
/**
 * Moves a column one step among `movableIds` (the columns a list shows), so a
 * hidden control column such as row selection never swallows a keypress.
 * Returns the new order, or `null` when the column is already at that end.
 */
export function moveDataGridColumn(table, columnId, delta, movableIds) {
  const order = getDataGridColumnOrder(table);
  const visibleOrder = order.filter(
    (id) => !movableIds || movableIds.includes(id)
  );
  const from = visibleOrder.indexOf(columnId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= visibleOrder.length) return null;
  const target = visibleOrder[to];
  const next = order.filter((id) => id !== columnId);
  const targetIndex = next.indexOf(target);
  next.splice(delta > 0 ? targetIndex + 1 : targetIndex, 0, columnId);
  table.setColumnOrder(next);
  return next;
}

export function normalizeDataGridPinning(pinning) {
  const value = pinning ?? {};
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((side) => [side, [...(value[side] ?? [])]])
  );
}
/**
 * Snapshots what a person changes about a grid's shape: column order (the full
 * resolved order), sizing, visibility and pinning, plus any `extra` view state
 * such as density. Data, sorting and filters are not part of a layout.
 */
export function getDataGridLayout(table, extra = {}) {
  return {
    columnOrder: getDataGridColumnOrder(table),
    columnSizing: { ...(readDataGridState(table, 'columnSizing') ?? {}) },
    columnVisibility: {
      ...(readDataGridState(table, 'columnVisibility') ?? {})
    },
    columnPinning: normalizeDataGridPinning(readDataGridState(table, 'columnPinning')),
    ...extra
  };
}
/** Applies every slice a layout carries; slices it omits keep their state. */
export function applyDataGridLayout(table, layout) {
  if (!layout) return;
  if (layout.columnOrder) table.setColumnOrder([...layout.columnOrder]);
  if (layout.columnSizing) table.setColumnSizing({ ...layout.columnSizing });
  if (layout.columnVisibility)
    table.setColumnVisibility({ ...layout.columnVisibility });
  if (layout.columnPinning)
    table.setColumnPinning(normalizeDataGridPinning(layout.columnPinning));
}
export function canonicalDataGridLayout(layout, columnIds) {
  if (!layout) return '';
  const known = (id) => !columnIds || columnIds.includes(id);
  const visibility = Object.entries(layout.columnVisibility ?? {})
    .filter(([id, visible]) => visible === false && known(id))
    .map(([id]) => id)
    .sort();
  const sizing = Object.entries(layout.columnSizing ?? {})
    .filter(([id]) => known(id))
    .sort(([a], [b]) => a.localeCompare(b));
  const pinning = Object.entries(normalizeDataGridPinning(layout.columnPinning)).map(
    ([side, ids]) => [side, ids.filter(known)]
  );
  const rest = Object.entries(layout)
    .filter(
      ([key]) =>
        !['columnOrder', 'columnSizing', 'columnVisibility', 'columnPinning'].includes(key)
    )
    .sort(([a], [b]) => a.localeCompare(b));
  // A partial order means "these first"; the grid appends the rest in leaf order.
  const order = (layout.columnOrder ?? []).filter(known);
  if (columnIds) order.push(...columnIds.filter((id) => !order.includes(id)));
  return JSON.stringify([
    order,
    visibility,
    sizing,
    pinning.filter(([, ids]) => ids.length),
    rest
  ]);
}
/**
 * Two layouts match when they would render the same grid: a column shown by
 * default equals one explicitly set visible, and slices for columns the grid
 * no longer has are ignored.
 */
export function isSameDataGridLayout(a, b, columnIds) {
  return canonicalDataGridLayout(a, columnIds) === canonicalDataGridLayout(b, columnIds);
}

// Control columns the card renders itself (selection) or has no use for.
const DATA_GRID_CARD_SKIPPED_IDS = new Set(['select', 'expand', 'drag', 'pin']);
/**
 * Sorts a row's visible cells into card slots. A column picks its slot with
 * `meta.card`: `title`, `subtitle`, `media`, `badge`, `actions`, `field` or
 * `false`. Without one, the first data column is the title, a display column
 * named `actions` holds the row menu, other display columns are skipped, and
 * every remaining data column becomes a labelled field.
 */
export function getDataGridCardSlots(row) {
  const slots = {
    title: null,
    subtitle: null,
    media: null,
    badges: [],
    actions: [],
    fields: []
  };
  const cells = [
    ...row.getStartVisibleCells(),
    ...row.getCenterVisibleCells(),
    ...row.getEndVisibleCells()
  ];
  for (const cell of cells) {
    const { column } = cell;
    const role = column.columnDef.meta?.card;
    if (role === false) continue;
    const isData = typeof column.accessorFn === 'function';
    const resolved =
      role ??
      (DATA_GRID_CARD_SKIPPED_IDS.has(column.id)
        ? null
        : !isData
          ? column.id === 'actions'
            ? 'actions'
            : null
          : slots.title
            ? 'field'
            : 'title');
    if (!resolved) continue;
    if (resolved === 'title' && !slots.title) slots.title = cell;
    else if (resolved === 'subtitle' && !slots.subtitle) slots.subtitle = cell;
    else if (resolved === 'media' && !slots.media) slots.media = cell;
    else if (resolved === 'badge') slots.badges.push(cell);
    else if (resolved === 'actions') slots.actions.push(cell);
    else slots.fields.push(cell);
  }
  return slots;
}

/**
 * A catalogue of columns a person can add at runtime, grouped for a Cascader.
 * Entries are `{ id, label, icon?, description?, keywords?, children? }`;
 * leaves also carry `column`, a TanStack column definition (its `id` defaults
 * to the entry id). The registry only describes columns: the host keeps the
 * list of added ids in state and builds its `columns` from it.
 */
export function createDataGridColumnRegistry(entries) {
  const leaves = new Map();
  const toNodes = (list, path = []) =>
    list.map((entry) => {
      const node = {
        value: entry.id,
        label: entry.label,
        icon: entry.icon,
        description: entry.description,
        keywords: entry.keywords
      };
      if (entry.children?.length) {
        node.children = toNodes(entry.children, [...path, entry.label]);
      } else {
        leaves.set(entry.id, {
          ...entry,
          path: [...path, entry.label],
          column: {
            header: entry.label,
            ...entry.column,
            id: entry.column?.id ?? entry.id,
            meta: { headerTitle: entry.label, ...entry.column?.meta }
          }
        });
      }
      return node;
    });
  const items = toNodes(entries);
  return {
    items,
    has: (id) => leaves.has(id),
    get: (id) => leaves.get(id) ?? null,
    getColumn: (id) => leaves.get(id)?.column ?? null,
    getColumns: (ids) =>
      ids.map((id) => leaves.get(id)?.column).filter(Boolean),
    /** Cascader items with already-added columns disabled. */
    itemsExcept(activeIds) {
      const active = new Set(activeIds);
      const mark = (nodes) =>
        nodes.map((node) =>
          node.children
            ? { ...node, children: mark(node.children) }
            : active.has(node.value)
              ? { ...node, disabled: true }
              : node
        );
      return mark(items);
    }
  };
}

export const DATA_GRID_STATUS_ALL = 'all';
/**
 * Exact-match filter for a status column. `dataGridFeatures` registers no
 * filter-function names, so a column filtered by status tabs takes this
 * function as its `filterFn`; an empty filter value matches every row.
 */
export function dataGridEqualsFilter(row, columnId, filterValue) {
  if (filterValue === void 0 || filterValue === null || filterValue === '')
    return true;
  return row.getValue(columnId) === filterValue;
}
dataGridEqualsFilter.autoRemove = (value) =>
  value === void 0 || value === null || value === '';
/**
 * Per-status counts from the column's faceted values. Facets apply every
 * other filter but not the column's own, so each tab says how many rows
 * choosing it would show.
 */
export function getDataGridStatusCounts(column, options) {
  const facets = column.getFacetedUniqueValues();
  const counts = { [DATA_GRID_STATUS_ALL]: column.getFacetedRowModel().rows.length };
  for (const option of options) counts[option.value] = facets.get(option.value) ?? 0;
  return counts;
}

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';
test('DataTable retains its display-only contract and a labelled scroll region', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url),
    {
      caption: 'Articles',
      columns: [{ key: 'title', header: 'Title' }],
      rows: [{ id: 'a', title: 'Field notes' }]
    }
  );
  assert.match(html, /<caption[^>]*>Articles/);
  assert.match(html, /scope="col"/);
  assert.match(html, /Field notes/);
  assert.doesNotMatch(html, /type="checkbox"/);
  assert.match(html, /aria-label="Articles scrollable table"/);
});
test('DataTable has an explicit empty state when rows are omitted', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url),
    { columns: [{ key: 'title', header: 'Title' }] }
  );
  assert.match(html, /No records/);
});
test('DataTable exposes the DataGrid editing API from its public entry', async () => {
  const entry = await loadComponent(new URL('../../../../src/components/core/DataTable/index.js', import.meta.url));
  for (const name of ['useDataGridHistory', 'useDataGridEditing', 'useDataGridRowEditing', 'DataGridSaveBar', 'DataGridHistoryControls', 'DataGridRowEditActions', 'DataGridCellToggle', 'DataGridCellInlineEditor', 'applyDataGridCellsChange', 'validateDataGridCellValue', 'invertDataGridCellsChange']) {
    assert.equal(typeof entry[name], 'function', `${name} is exported`);
  }
});


const { getDataGridRollupRows, moveDataGridRow } = await loadComponent(new URL('../../../../src/components/core/DataTable/dataGridStructureModel.js', import.meta.url));
const tree = () => [
  { id: 'docs', children: [{ id: 'a' }, { id: 'b' }] },
  { id: 'media', children: [{ id: 'c' }] },
  { id: 'loose' }
];
const shape = (rows) => rows.map((row) => (row.children ? { [row.id]: shape(row.children) } : row.id));
test('moveDataGridRow reparents nested rows and reorders flat lists from one move report', () => {
  assert.deepEqual(shape(moveDataGridRow(tree(), { id: 'a', parentId: 'media', index: 1 }, { childrenKey: 'children' })), [{ docs: ['b'] }, { media: ['c', 'a'] }, 'loose']);
  assert.deepEqual(shape(moveDataGridRow(tree(), { id: 'loose', parentId: 'docs', index: 0 }, { childrenKey: 'children' })), [{ docs: ['loose', 'a', 'b'] }, { media: ['c'] }]);
  assert.deepEqual(shape(moveDataGridRow(tree(), { id: 'c', parentId: null, index: 0 }, { childrenKey: 'children' })), ['c', { docs: ['a', 'b'] }, { media: [] }, 'loose']);
  // An unknown parent leaves the data untouched rather than dropping the row.
  const data = tree();
  assert.equal(moveDataGridRow(data, { id: 'a', parentId: 'nowhere', index: 0 }, { childrenKey: 'children' }), data);
  const flat = ['s1', 's2', 's3', 's4'].map((id) => ({ id }));
  assert.deepEqual(moveDataGridRow(flat, { id: 's4', targetId: 's1', position: 'before' }).map((row) => row.id), ['s4', 's1', 's2', 's3']);
  assert.deepEqual(moveDataGridRow(flat, { id: 's1', targetId: 's3', position: 'after' }).map((row) => row.id), ['s2', 's3', 's1', 's4']);
  assert.deepEqual(moveDataGridRow(flat, { id: 's2', index: 3 }).map((row) => row.id), ['s1', 's3', 's4', 's2']);
});
test('tree rollups aggregate the deepest loaded rows and keep unloaded parents as leaves', () => {
  const row = (id, subRows = []) => ({ id, subRows });
  const rows = [row('docs', [row('a'), row('nested', [row('b')])]), row('unloaded')];
  assert.deepEqual(getDataGridRollupRows(rows).map((item) => item.id), ['a', 'b', 'unloaded']);
});
const renderPattern = async (slug) => {
  const { Pattern } = await loadComponent(new URL(`../../../../src/components/core/DataTable/stories/fixtures/data-grid/data-grid-${slug}.jsx`, import.meta.url));
  return renderToStaticMarkup(createElement(Pattern));
};
test('banded sections repeat column headers per band and keep empty bands', async () => {
  const html = await renderPattern('editorial-desk');
  assert.equal(html.match(/data-slot="data-grid-section"/g)?.length, 4);
  assert.equal(html.match(/<caption[^>]*>/g)?.length, 4);
  assert.equal(html.match(/<thead/g)?.length, 4);
  for (const tone of ['discovery', 'info', 'warning', 'success']) assert.match(html, new RegExp(`data-tone="${tone}"`));
  assert.match(html, /aria-label="Select all in Drafting"/);
  assert.match(html, /Nothing in Ready yet\./);
  assert.match(html, /aria-expanded="true"[^>]*aria-controls=/);
});
test('the tree grid renders rollups, cascading checkboxes, grips and a grand total', async () => {
  const html = await renderPattern('shared-drive');
  assert.match(html, /data-slot="data-grid-tree-dnd-handle"/);
  assert.match(html, /data-slot="data-grid-rollup"/);
  assert.match(html, /All files/);
  assert.match(html, /aria-label="Select all"/);
});


// DataGrid view controls. A real TanStack table, built through `useTable` during
// a static render, exercises the helpers against the registered grid features.
const { useTable } = await import('@tanstack/react-table');
const grid = await loadComponent(new URL('../../../../src/components/core/DataTable/index.js', import.meta.url));
const heatmap = await loadComponent(new URL('../../../../src/components/charts/HeatmapChart/index.js', import.meta.url));
const crm = await loadComponent(new URL('../../../../src/components/core/DataTable/stories/fixtures/data-grid/data-grid-crm.jsx', import.meta.url));
const shipments = await loadComponent(new URL('../../../../src/components/core/DataTable/stories/fixtures/data-grid/data-grid-shipment-exceptions.jsx', import.meta.url));
const records = [
  { id: 'a', title: 'Alpha', status: 'open', amount: 10, due: new Date('2026-01-02') },
  { id: 'b', title: 'Beta', status: 'closed', amount: 30, due: new Date('2026-03-04') },
  { id: 'c', title: 'Gamma', status: 'open', amount: null, due: new Date('2026-02-01') }
];
const gridColumns = [
  { id: 'select', header: 'Select', cell: () => null },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status', filterFn: grid.dataGridEqualsFilter },
  { accessorKey: 'amount', header: 'Amount', aggregationFn: 'sum' },
  { accessorKey: 'due', header: 'Due' },
  { id: 'actions', header: 'Actions', cell: () => null }
];
function makeTable(options = {}) {
  let table;
  function Harness() {
    table = useTable({ features: grid.dataGridFeatures, columns: gridColumns, data: records, getRowId: (row) => row.id, ...options });
    return null;
  }
  renderToStaticMarkup(createElement(Harness));
  return table;
}
const statsOf = (column, options) => Object.fromEntries(grid.getDataGridColumnStats(column, options).map((stat) => [stat.id, stat.value]));

test('column stats count, distinct and empty values and aggregate numbers and dates over filtered rows', () => {
  const table = makeTable();
  assert.deepEqual(statsOf(table.getColumn('amount')), { count: 2, distinct: 2, empty: 1, min: 10, max: 30, avg: 20, sum: 40 });
  assert.deepEqual(Object.keys(statsOf(table.getColumn('due'))), ['count', 'distinct', 'empty', 'min', 'max']);
  assert.equal(statsOf(table.getColumn('due')).max.toISOString().slice(0, 10), '2026-03-04');
  assert.deepEqual(statsOf(table.getColumn('status')), { count: 3, distinct: 2, empty: 0 });
  assert.deepEqual(statsOf(table.getColumn('amount'), { kinds: ['sum', 'max'] }), { sum: 40, max: 30 });
  // Stats follow the rows a person can see.
  table.getColumn('status').setFilterValue('open');
  assert.equal(statsOf(table.getColumn('amount')).sum, 10);
  // Status tabs count each value from facets that ignore the column's own filter.
  assert.deepEqual(grid.getDataGridStatusCounts(table.getColumn('status'), [{ value: 'open' }, { value: 'closed' }]), { all: 3, open: 2, closed: 1 });
});

test('layouts snapshot, compare and restore column order, visibility, sizing and pinning', () => {
  const table = makeTable();
  const initial = grid.getDataGridLayout(table, { density: 'comfortable' });
  assert.deepEqual(initial.columnOrder, ['select', 'title', 'status', 'amount', 'due', 'actions']);
  const ids = initial.columnOrder;
  table.getColumn('due').toggleVisibility(false);
  table.getColumn('title').pin('start');
  table.setColumnSizing({ title: 220 });
  assert.deepEqual(grid.moveDataGridColumn(table, 'amount', -1, ['title', 'status', 'amount', 'due']), ['select', 'title', 'amount', 'status', 'due', 'actions']);
  const changed = grid.getDataGridLayout(table, { density: 'comfortable' });
  assert.equal(grid.isSameDataGridLayout(initial, changed, ids), false);
  // A column set visible explicitly equals one visible by default; a partial order is "these first".
  assert.equal(grid.isSameDataGridLayout({ ...initial, columnVisibility: { due: true } }, initial, ids), true);
  assert.equal(grid.isSameDataGridLayout({ ...initial, columnOrder: ['select', 'title'] }, initial, ids), true);
  grid.applyDataGridLayout(table, initial);
  assert.equal(grid.isSameDataGridLayout(grid.getDataGridLayout(table, { density: 'comfortable' }), initial, ids), true);
  assert.equal(table.getColumn('due').getIsVisible(), true);
  assert.equal(table.getColumn('title').getIsPinned(), false);
  // Moving past either end is refused.
  assert.equal(grid.moveDataGridColumn(table, 'select', -1), null);
});

test('cards sort cells into title, actions and labelled fields, and column meta overrides the slots', () => {
  const table = makeTable();
  const slots = grid.getDataGridCardSlots(table.getRow('a'));
  assert.equal(slots.title.column.id, 'title');
  assert.deepEqual(slots.fields.map((cell) => cell.column.id), ['status', 'amount', 'due']);
  assert.deepEqual(slots.actions.map((cell) => cell.column.id), ['actions']);
  const custom = makeTable({ columns: gridColumns.map((column) => (column.accessorKey === 'status' ? { ...column, meta: { card: 'badge' } } : column.accessorKey === 'due' ? { ...column, meta: { card: false } } : column)) });
  const customSlots = grid.getDataGridCardSlots(custom.getRow('a'));
  assert.deepEqual(customSlots.badges.map((cell) => cell.column.id), ['status']);
  assert.deepEqual(customSlots.fields.map((cell) => cell.column.id), ['amount']);
});

test('the column registry builds Cascader items and column definitions, and disables added columns', () => {
  const registry = grid.createDataGridColumnRegistry([
    { id: 'billing', label: 'Billing', children: [{ id: 'mrr', label: 'MRR', column: { accessorKey: 'mrr' } }, { id: 'plan', label: 'Plan', column: { accessorKey: 'plan', meta: { stats: true } } }] }
  ]);
  assert.equal(registry.items[0].children.length, 2);
  assert.deepEqual(registry.getColumn('mrr'), { header: 'MRR', accessorKey: 'mrr', id: 'mrr', meta: { headerTitle: 'MRR' } });
  assert.equal(registry.getColumn('plan').meta.stats, true);
  assert.deepEqual(registry.getColumns(['plan', 'missing']).map((column) => column.id), ['plan']);
  assert.equal(registry.itemsExcept(['mrr'])[0].children[0].disabled, true);
  assert.equal(registry.itemsExcept(['mrr'])[0].children[1].disabled, undefined);
});

test('heat cells use the HeatmapChart colour scale from the chart tokens', () => {
  const cases = [[null, { domain: [0, 10] }], [0, { domain: [0, 10] }], [4, { domain: [0, 10] }], [10, { domain: [0, 10] }], [5, { domain: [5, 5] }], [-5, { domain: [-5, 5], scale: 'diverging' }], [0, { domain: [-5, 5], scale: 'diverging' }], [5, { domain: [-5, 5], scale: 'diverging' }]];
  for (const [value, options] of cases) {
    const chart = heatmap.heatmapStep(value, options);
    const cell = grid.getDataGridHeatmapColor(value, options);
    assert.deepEqual([cell.background, cell.color], [chart.fill, chart.ink], `${value} on ${JSON.stringify(options)}`);
  }
});

test('the CRM workspace renders status tabs with counts, the view controls and heat cells', () => {
  const html = renderToStaticMarkup(createElement(crm.Pattern));
  assert.match(html, /aria-label="All, 24"/);
  assert.match(html, /aria-label="Won, 5"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-label="Add column"/);
  assert.match(html, /aria-label="Layouts: Default"/);
  assert.match(html, /aria-label="Table"/);
  assert.match(html, /data-slot="data-grid-heatmap-cell" data-heat-step="[1-5]"/);
  assert.match(html, /data-row-pinned="top"/);
  // Charts stay out of the first render: the trend cell is a lazy Sparkline.
  assert.doesNotMatch(html, /data-slot="chart"/);
});

test('the shipment grid loads one page of five thousand records with selection controls', () => {
  const html = renderToStaticMarkup(createElement(shipments.Pattern));
  assert.match(html, /100 \/ 5,000/);
  assert.match(html, /aria-label="Select all"/);
  assert.doesNotMatch(html, /aria-label="Bulk actions"/);
});

test('the shared table engine preserves unpaged collections and page-local selection semantics', async () => {
  const rows = Array.from({ length: 12 }, (_, index) => ({ id: String(index), title: `Record ${index}` }));
  const props = { rows, columns: [{ key: 'title', header: 'Title' }], pageSize: 5, selectable: true, defaultSelection: Object.fromEntries(rows.map(row => [row.id, true])) };
  const unpaged = await renderComponent(new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url), props);
  assert.equal(unpaged.match(/data-row-id=/g)?.length, 12, 'turning pagination off keeps every row');
  const paged = await renderComponent(new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url), { ...props, pagination: true });
  assert.equal(paged.match(/data-row-id=/g)?.length, 5);
  assert.match(paged, /aria-label="Select this page"[^>]*aria-checked="true"|aria-checked="true"[^>]*aria-label="Select this page"/);
  assert.doesNotMatch(paged, /aria-label="Select this page"[^>]*aria-checked="mixed"|aria-checked="mixed"[^>]*aria-label="Select this page"/);
});

test('custom sortingFn columns keep the convenience API when rendered by the shared engine', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url), {
    rows: [{ id: 'a', title: 'A long title' }, { id: 'b', title: 'Brief' }],
    columns: [{ key: 'title', header: 'Title', sortingFn: (a, b, key) => a.getValue(key).length - b.getValue(key).length }],
    sortable: true,
    sorting: [{ id: 'title', desc: false }]
  });
  assert.ok(html.indexOf('data-row-id="b"') < html.indexOf('data-row-id="a"'), 'host comparator controls visible order');
});

test('DataTable names rows through getRowLabel and styles header cells with the column className', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url), {
    caption: 'Articles',
    selectable: true,
    getRowLabel: (row) => row.title,
    columns: [{ key: 'title', header: 'Title', className: 'w-64' }],
    rows: [{ id: 'a1', title: 'Field notes' }]
  });
  assert.match(html, /aria-label="Select row Field notes"/);
  assert.match(html, /<th[^>]*class="[^"]*w-64[^"]*"[^>]*>/);
  const named = await renderComponent(new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url), {
    caption: 'Articles',
    labels: { scrollRegion: (caption) => `Tableau ${caption}` },
    columns: [{ key: 'title', header: 'Title' }],
    rows: [{ id: 'a1', title: 'Field notes' }]
  });
  assert.match(named, /aria-label="Tableau Articles"/);
});

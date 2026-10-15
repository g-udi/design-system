import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTable } from '@tanstack/react-table';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

const { csvEscape, getTableExportRows, tableToCsv, toCsv } = await import('../../../../src/components/core/DataTable/tableExport.js');
const grouping = await loadComponent(new URL('../../../../src/components/core/DataTable/stories/fixtures/data-grid/data-grid-grouping.jsx', import.meta.url));
const exporting = await loadComponent(new URL('../../../../src/components/core/DataTable/stories/fixtures/data-grid/data-grid-csv-export.jsx', import.meta.url));
const tableUrl = new URL('../../../../src/components/core/DataTable/DataTable.jsx', import.meta.url);
const { dataGridFeatures } = await loadComponent(new URL('../../../../src/components/core/DataTable/dataGridFeatures.js', import.meta.url));

test('CSV escapes delimiters, quotes and line breaks, and neutralises formula-like text', () => {
  const csv = toCsv(
    [{ title: 'Notes, drafts', note: 'Asked for "longer" essays\nplease', formula: '=HYPERLINK("x")', change: -3.2, tags: ['a', 'b'] }],
    [
      { header: 'Title', value: (row) => row.title },
      { header: 'Note', value: (row) => row.note },
      { header: 'Formula', value: (row) => row.formula },
      { header: 'Change', value: (row) => row.change },
      { header: 'Tags', value: (row) => row.tags }
    ]
  );
  const [header, line] = csv.split('\r\n');
  assert.equal(header, 'Title,Note,Formula,Change,Tags');
  assert.match(line, /^"Notes, drafts","Asked for ""longer"" essays\nplease",/);
  assert.match(line, /,"'=HYPERLINK\(""x""\)",-3\.2,a; b$/);
  assert.equal(csvEscape(new Date('2026-10-01T00:00:00Z')), '2026-10-01T00:00:00.000Z');
  assert.equal(csvEscape('a;b', { delimiter: ';' }), '"a;b"');
  assert.equal(csvEscape(null), '');
});

// A minimal table with the row models an export reads, shaped like TanStack's.
function fakeTable({ selected = [] } = {}) {
  const record = (id, title, words) => ({ id, original: { id, title, words, secret: 'x' }, getValue: (key) => ({ title, words })[key], getIsGrouped: () => false });
  const rows = [record('b', 'Beta', 20), record('a', 'Alpha', 10)];
  const column = (id, meta = {}, accessor = true) => ({ id, accessorFn: accessor ? () => {} : undefined, columnDef: { header: id[0].toUpperCase() + id.slice(1), meta } });
  return {
    getVisibleLeafColumns: () => [column('select', { export: false }), column('title'), column('words', { exportValue: (value) => `${value} words` }), column('menu', {}, false)],
    getPrePaginationRowModel: () => ({ rows }),
    getRowModel: () => ({ rows: rows.slice(0, 1) }),
    getFilteredSelectedRowModel: () => ({ rows: rows.filter((row) => selected.includes(row.id)) })
  };
}

test('table export follows visible columns, the current order and the selection', () => {
  assert.equal(tableToCsv(fakeTable()), 'Title,Words\r\nBeta,20 words\r\nAlpha,10 words');
  assert.equal(tableToCsv(fakeTable({ selected: ['a'] })), 'Title,Words\r\nAlpha,10 words');
  assert.equal(tableToCsv(fakeTable({ selected: ['a'] }), { scope: 'filtered' }).split('\r\n').length, 3);
  assert.equal(getTableExportRows(fakeTable(), 'page').length, 1);
});

test('CSV follows pinned column display order rather than the underlying leaf order', () => {
  let table;
  function Harness() {
    table = useTable({
      features: dataGridFeatures,
      columns: [{ accessorKey: 'title', header: 'Title' }, { accessorKey: 'words', header: 'Words' }],
      data: [{ title: 'Alpha', words: 10 }],
      initialState: { columnPinning: { start: ['words'], end: [] } }
    });
    return null;
  }
  renderToStaticMarkup(createElement(Harness));
  assert.deepEqual(table.getVisibleLeafColumns().map((column) => column.id), ['title', 'words']);
  assert.equal(tableToCsv(table), 'Words,Title\r\n10,Alpha');
  table.setColumnPinning({ start: [], end: ['title'] });
  assert.equal(tableToCsv(table), 'Words,Title\r\n10,Alpha');
});

test('DataGrid groups rows into collapsible bands with aggregated values and grand totals', () => {
  const html = renderToStaticMarkup(createElement(grouping.Pattern));
  assert.match(html, /aria-label="Collapse Engineering"[^>]*aria-expanded="true"|aria-expanded="true"[^>]*aria-label="Collapse Engineering"/);
  assert.match(html, /data-row-grouped="true"/);
  assert.match(html, /4 rows/);
  assert.match(html, /4 articles/);
  // Engineering words: 2480 + 940 + 2050 + 1720.
  assert.match(html, /7,190/);
  // The footer totals every article through column.getAggregationValue().
  assert.match(html, /21,950/);
  assert.match(html, /Export CSV/);
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('DataGrid export renders an accessible action without writing the file on the server', () => {
  const html = renderToStaticMarkup(createElement(exporting.Pattern));
  assert.match(html, />Export CSV</);
  assert.match(html, /role="status"/);
});

const columns = [
  { key: 'title', header: 'Title' },
  { key: 'words', header: 'Words', align: 'right' }
];
const rows = [
  { id: 'a', title: 'Alpha', words: 10 },
  { id: 'b', title: 'Beta', words: 20 },
  { id: 'c', title: 'Gamma', words: 30 }
];

test('DataTable pins rows above and below the others and keeps a sticky header in its region', async () => {
  const html = await renderComponent(tableUrl, { caption: 'Articles', columns, rows, maxHeight: '12rem', defaultRowPinning: { top: ['c'], bottom: ['a'] } });
  const order = [...html.matchAll(/data-row-id="(\w)"/g)].map((match) => match[1]);
  assert.deepEqual(order, ['c', 'b', 'a']);
  assert.match(html, /data-row-id="c"[^>]*data-row-pinned="top"|data-row-pinned="top"[^>]*data-row-id="c"/);
  assert.match(html, /data-row-pinned="bottom"/);
  assert.match(html, /<table[^>]*data-sticky="container"/);
  assert.match(html, /max-height:12rem/);
});

test('DataTable gates row activation, offers export and load more, and virtualizes long lists', async () => {
  const gated = await renderComponent(tableUrl, { columns, rows, onRowClick: () => {}, canActivateRow: (row) => row.id !== 'b' });
  assert.equal([...gated.matchAll(/data-interactive="true"/g)].length, 2);
  const tools = await renderComponent(tableUrl, { columns, rows, exportable: true, onLoadMore: () => {}, hasMore: true });
  assert.match(tools, />Export CSV</);
  assert.match(tools, />Load more</);
  const many = Array.from({ length: 150 }, (_, index) => ({ id: `r${index}`, title: `Row ${index}`, words: index }));
  const virtual = await renderComponent(tableUrl, { columns, rows: many });
  assert.match(virtual, /aria-rowcount="151"/);
  assert.match(virtual, /max-height:32rem/);
  const flat = await renderComponent(tableUrl, { columns, rows: many, virtualize: false });
  assert.doesNotMatch(flat, /aria-rowcount/);
  assert.equal([...flat.matchAll(/class="ds-table-row"/g)].length, 150);
});

test('DataTable numbers multi-column sorts and accepts controlled sorting', async () => {
  const html = await renderComponent(tableUrl, { columns, rows, sortable: true, multiSort: true, sorting: [{ id: 'words', desc: true }, { id: 'title', desc: false }] });
  assert.match(html, /aria-sort="descending"/);
  assert.match(html, /ds-table-sort-order/);
  const order = [...html.matchAll(/data-row-id="(\w)"/g)].map((match) => match[1]);
  assert.deepEqual(order, ['c', 'b', 'a']);
});

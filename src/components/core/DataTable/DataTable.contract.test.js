import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent, renderComponent } from '../../../test-support/renderComponent.js';
test('DataTable retains its display-only contract and a labelled scroll region', async () => {
  const html = await renderComponent(
    new URL('./DataTable.jsx', import.meta.url),
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
    new URL('./DataTable.jsx', import.meta.url),
    { columns: [{ key: 'title', header: 'Title' }] }
  );
  assert.match(html, /No records/);
});
test('DataTable exposes the DataGrid editing API from its public entry', async () => {
  const entry = await loadComponent(new URL('./index.js', import.meta.url));
  for (const name of ['useDataGridHistory', 'useDataGridEditing', 'useDataGridRowEditing', 'DataGridSaveBar', 'DataGridHistoryControls', 'DataGridRowEditActions', 'DataGridCellToggle', 'DataGridCellInlineEditor', 'applyDataGridCellsChange', 'validateDataGridCellValue', 'invertDataGridCellsChange']) {
    assert.equal(typeof entry[name], 'function', `${name} is exported`);
  }
});


const { getDataGridRollupRows, moveDataGridRow } = await loadComponent(new URL('./parts/data-grid-tree-rows-extended.jsx', import.meta.url));
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
const renderPattern = async (number) => {
  const { Pattern } = await loadComponent(new URL(`../../../../.storybook/fixtures/patterns/data-grid/c-data-grid-${number}.jsx`, import.meta.url));
  return renderToStaticMarkup(createElement(Pattern));
};
test('banded sections repeat column headers per band and keep empty bands', async () => {
  const html = await renderPattern(46);
  assert.equal(html.match(/data-slot="data-grid-section"/g)?.length, 4);
  assert.equal(html.match(/<caption[^>]*>/g)?.length, 4);
  assert.equal(html.match(/<thead/g)?.length, 4);
  for (const tone of ['discovery', 'info', 'warning', 'success']) assert.match(html, new RegExp(`data-tone="${tone}"`));
  assert.match(html, /aria-label="Select all in Drafting"/);
  assert.match(html, /Nothing in Ready yet\./);
  assert.match(html, /aria-expanded="true"[^>]*aria-controls=/);
});
test('the tree grid renders rollups, cascading checkboxes, grips and a grand total', async () => {
  const html = await renderPattern(45);
  assert.match(html, /data-slot="data-grid-tree-dnd-handle"/);
  assert.match(html, /data-slot="data-grid-rollup"/);
  assert.match(html, /All files/);
  assert.match(html, /aria-label="Select all"/);
});

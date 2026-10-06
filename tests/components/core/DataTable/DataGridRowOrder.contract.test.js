import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTable } from '@tanstack/react-table';
import { loadComponent } from '../../../support/renderComponent.js';
import { getDataGridActiveRegionGrid, getDataGridVisibleSelectedCellCount } from '../../../../src/components/core/DataTable/dataGridSelectionModel.js';

const { DataGrid, DataGridTable, DataGridTableVirtual, dataGridFeatures } = await loadComponent(new URL('../../../../src/components/core/DataTable/index.js', import.meta.url));
const data = ['a', 'b', 'c', 'd', 'e'].map(id => ({ id, title: id.toUpperCase() }));
const columns = [{ accessorKey: 'title', header: 'Title' }];
function createGrid({ page, virtual = false } = {}) {
  let table;
  const render = (rowsPinnable = true) => renderToStaticMarkup(createElement(DataGrid, { table, tableLayout: { cellSelection: true, rowsPinnable } }, createElement(virtual ? DataGridTableVirtual : DataGridTable, virtual ? { height: 200, virtualizerOptions: { enabled: false } } : {})));
  function Harness() {
    table = useTable({ features: dataGridFeatures, data, columns, getRowId: row => row.id, manualPagination: page === undefined, initialState: { rowPinning: { top: ['e'], bottom: ['a'] }, ...(page === undefined ? {} : { pagination: { pageIndex: page, pageSize: 2 } }) } });
    return null;
  }
  renderToStaticMarkup(createElement(Harness));
  return { table, render };
}
const rowAttributes = html => [...html.matchAll(/<tr[^>]*data-row-id="([^"]+)"[^>]*aria-rowindex="(\d+)"/g)].map(([, id, index]) => [id, Number(index)]);
const select = (table, anchorRowId, focusRowId = anchorRowId) => table.selectCellRange({ anchorRowId, focusRowId, anchorColumnId: 'title', focusColumnId: 'title' }, { mode: 'replace' });

test('pinned rows share rendered order with ARIA, keyboard, range selection and clipboard', () => {
  const { table, render } = createGrid();
  assert.deepEqual(rowAttributes(render()), [['e', 2], ['b', 3], ['c', 4], ['d', 5], ['a', 6]]);
  table.setFocusedCell('e', 'title');
  table.moveCellSelection('down');
  assert.equal(table.getFocusedCell().row.id, 'b');
  table.setFocusedCell('e', 'title');
  select(table, 'e');
  table.extendCellSelection('down');
  table.extendCellSelection('down');
  assert.deepEqual(table.getSelectedCellIds(), ['e_title', 'b_title', 'c_title']);
  assert.deepEqual(getDataGridActiveRegionGrid(table), [['E'], ['B'], ['C']]);
  assert.deepEqual(rowAttributes(render(false)), [['a', 2], ['b', 3], ['c', 4], ['d', 5], ['e', 6]]);
  assert.deepEqual(table.getRowsInDisplayOrder().map(row => row.id), ['a', 'b', 'c', 'd', 'e']);
  table.setRowPinning({ top: ['d'], bottom: ['b'] });
  assert.deepEqual(rowAttributes(render()), [['d', 2], ['a', 3], ['c', 4], ['e', 5], ['b', 6]]);
});

for (const virtual of [false, true]) test(`${virtual ? 'virtual' : 'regular'} paginated grids retain absolute indices and skip hidden pages when stepping/copying`, () => {
  const { table, render } = createGrid({ page: 1, virtual });
  assert.deepEqual(rowAttributes(render()), [['e', 2], ['c', 4], ['d', 5], ['a', 6]]);
  assert.deepEqual(table.getRowModel().rows.map(row => row.id), ['c', 'd']);
  table.setFocusedCell('e', 'title');
  table.moveCellSelection('down');
  assert.equal(table.getFocusedCell().row.id, 'c');
  table.moveCellSelection('down');
  assert.equal(table.getFocusedCell().row.id, 'd');
  table.moveCellSelection('down');
  assert.equal(table.getFocusedCell().row.id, 'a');
  select(table, 'e', 'd');
  const viewport = { querySelectorAll: () => ['e', 'c', 'd', 'a'].map(id => ({ getAttribute: () => id })) };
  assert.deepEqual(getDataGridActiveRegionGrid(table, viewport), [['E'], ['C'], ['D']]);
  assert.equal(getDataGridVisibleSelectedCellCount(table, viewport), 3);
});

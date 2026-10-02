import assert from 'node:assert/strict';
import test from 'node:test';
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

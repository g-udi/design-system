import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../support/renderComponent.js';
const {
  applyDataGridCellsChange,
  formatDataGridCellEditValue,
  resolveDataGridCellEdit,
  validateDataGridCellValue
} = await loadComponent(new URL('../../../../src/components/core/DataTable/cellEditing.js', import.meta.url));
const { invertDataGridCellsChange } = await loadComponent(new URL('../../../../src/components/core/DataTable/components/DataGridCellSelection.jsx', import.meta.url));

test('built-in editors parse and format clipboard text', () => {
  const number = resolveDataGridCellEdit({ control: 'number' });
  assert.equal(number.parse('$1,250.5'), 1250.5);
  assert.equal(number.parse('abc'), undefined);
  assert.equal(number.parse('abc123'), undefined);
  assert.equal(number.parse('£1,250.5'), 1250.5);
  assert.equal(number.parse('€-12'), -12);
  assert.equal(number.parse(''), null);
  const select = resolveDataGridCellEdit({ control: 'select', options: [{ value: 'audio', label: 'Audio' }, 'Storage'] });
  assert.equal(select.parse('audio'), 'audio');
  assert.equal(select.parse(' AUDIO '), 'audio');
  assert.equal(select.parse('Storage'), 'Storage');
  assert.equal(select.parse('Video'), undefined);
  assert.equal(select.format('audio'), 'Audio');
  const date = resolveDataGridCellEdit({ control: 'date' });
  assert.equal(date.parse('Oct 14, 2026'), '2026-10-14');
  assert.equal(date.parse('2026-10-14'), '2026-10-14');
  assert.equal(date.parse('soon'), undefined);
  assert.equal(formatDataGridCellEditValue({ control: 'date' }, '2026-10-14'), 'Oct 14, 2026');
  const toggle = resolveDataGridCellEdit({ control: 'switch' });
  assert.equal(toggle.parse('Yes'), true);
  assert.equal(toggle.parse('0'), false);
  assert.equal(toggle.parse('maybe'), undefined);
  assert.equal(toggle.clearValue, false);
  // A column's own parse wins over the built-in one.
  const custom = { control: 'number', parse: () => 7 };
  assert.equal(resolveDataGridCellEdit(custom).parse('x'), 7);
});

test('validation covers required, number bounds and validate(value, row)', () => {
  assert.equal(validateDataGridCellValue({ required: 'Name it' }, ' ', {}), 'Name it');
  assert.equal(validateDataGridCellValue({ required: true }, [], {}), 'Required');
  assert.equal(validateDataGridCellValue({ control: 'number', min: 0 }, -1, {}), 'Must be 0 or more');
  assert.equal(validateDataGridCellValue({ control: 'number' }, '12a', {}), 'Enter a number');
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(validateDataGridCellValue({ control: 'number' }, value, {}), 'Enter a number');
  }
  const yearly = { validate: (value, row) => (row.interval === 'year' && value < 50 ? 'Too low' : null) };
  assert.equal(validateDataGridCellValue(yearly, 20, { interval: 'year' }), 'Too low');
  assert.equal(validateDataGridCellValue(yearly, 20, { interval: 'month' }), null);
  assert.equal(validateDataGridCellValue({ validate: () => false }, 1, {}), 'Enter a valid value');
});

test('a change batch applies, inverts and applies back without touching other records', () => {
  const rows = [{ id: 'a', stock: 1, meta: { tag: 'x' } }, { id: 'b', stock: 2 }];
  const columns = [{ accessorKey: 'stock', meta: { cellEdit: {} } }, { accessorKey: 'meta.tag', meta: { cellEdit: {} } }];
  const details = {
    source: 'paste',
    changes: [
      { rowId: 'a', columnId: 'stock', previousValue: 1, value: 5 },
      { rowId: 'a', columnId: 'meta_tag', previousValue: 'x', value: 'y' }
    ],
    rejected: []
  };
  const next = applyDataGridCellsChange(rows, details, { columns });
  assert.deepEqual(next[0], { id: 'a', stock: 5, meta: { tag: 'y' } });
  assert.equal(next[1], rows[1]);
  const undone = applyDataGridCellsChange(next, invertDataGridCellsChange(details), { columns });
  assert.deepEqual(undone, rows);
});

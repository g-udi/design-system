import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../test-support/renderComponent.js';
const { parseDataGridClipboardText, serializeDataGridClipboardText } = await loadComponent(new URL('./parts/data-grid-cell-selection-extended.jsx', import.meta.url));
test('spreadsheet clipboard preserves quoted tabs, multiline cells, quotes, and empty cells', () => {
  const cells = [['Name', 'Notes', ''], ['A\tB', 'Line one\nLine "two"', '42']];
  assert.deepEqual(parseDataGridClipboardText(serializeDataGridClipboardText(cells)), cells);
  assert.deepEqual(parseDataGridClipboardText('A\tB\r\nC\tD\r\n'), [['A', 'B'], ['C', 'D']]);
});

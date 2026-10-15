import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../support/renderComponent.js';
const { parseDataGridClipboardText, serializeDataGridClipboardText } = await loadComponent(new URL('../../../../src/components/core/DataTable/dataGridClipboard.js', import.meta.url));
test('spreadsheet clipboard preserves quoted tabs, multiline cells, quotes, and empty cells', () => {
  const cells = [['Name', 'Notes', ''], ['A\tB', 'Line one\nLine "two"', '42']];
  assert.deepEqual(parseDataGridClipboardText(serializeDataGridClipboardText(cells)), cells);
  assert.deepEqual(parseDataGridClipboardText('A\tB\r\nC\tD\r\n'), [['A', 'B'], ['C', 'D']]);
});

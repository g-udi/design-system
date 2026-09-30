import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';
test('Select preserves numeric zero values and disables its form submission with its trigger', async () => {
  const html = await renderComponent(new URL('./Select.jsx', import.meta.url), {
    'aria-label': 'Priority',
    id: 'priority',
    name: 'priority',
    disabled: true,
    value: 0,
    options: [{ value: 0, label: 'Normal' }]
  });
  const hidden = html.match(/<input[^>]*>/)[0];
  assert.match(hidden, /value="0"/);
  assert.match(hidden, /disabled=""/);
  assert.match(html, /id="priority"/);
  assert.match(html, />Normal<\/span>/);
});

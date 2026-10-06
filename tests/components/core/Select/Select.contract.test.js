import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderComponent } from '../../../support/renderComponent.js';
test('Select preserves numeric zero values and disables its form submission with its trigger', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Select/Select.jsx', import.meta.url), {
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


test('Select preserves native option text as its implicit value', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Select/Select.jsx', import.meta.url), {
    'aria-label': 'Priority',
    defaultValue: 'Normal',
    children: [
      createElement('option', { key: 'normal' }, 'Normal'),
      createElement('option', { key: 'urgent', value: 'urgent' }, 'Urgent')
    ]
  });
  assert.match(html, />Normal<\/span>/);
  assert.match(html, /value="Normal"/);
});

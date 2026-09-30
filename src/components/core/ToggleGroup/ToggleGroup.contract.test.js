import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('ToggleGroup preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./ToggleGroup.jsx', import.meta.url),
    {
      label: 'View',
      defaultValue: 'list',
      options: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid', disabled: true }
      ]
    }
  );
  assert.match(html, /aria-label="View"/);
  assert.match(html, /data-state="on"/);
  assert.match(html, /disabled=""/);
});

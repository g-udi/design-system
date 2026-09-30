import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('DropdownMenu preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./DropdownMenu.jsx', import.meta.url),
    { children: 'Items' }
  );
  assert.equal(html, '');
});

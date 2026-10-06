import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('DropdownMenu preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/DropdownMenu/DropdownMenu.jsx', import.meta.url),
    { children: 'Items' }
  );
  assert.equal(html, '');
});

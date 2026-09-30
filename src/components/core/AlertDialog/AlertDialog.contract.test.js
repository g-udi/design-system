import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('AlertDialog preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./AlertDialog.jsx', import.meta.url),
    { title: 'Archive?', description: 'Restore it later.', open: false }
  );
  assert.equal(html, '');
});

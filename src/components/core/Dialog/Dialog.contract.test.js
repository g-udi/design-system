import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Dialog preserves its server-rendered public contract across variants', async () => {
  for (const variant of ['modal', 'sheet', 'confirmation']) {
    const html = await renderComponent(new URL('./Dialog.jsx', import.meta.url), {
      title: 'Details',
      variant,
      open: false
    });
    assert.equal(html, '');
  }
});

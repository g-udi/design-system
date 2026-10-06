import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Dialog preserves its server-rendered public contract across variants', async () => {
  for (const variant of ['modal', 'confirmation']) {
    const html = await renderComponent(new URL('../../../../src/components/core/Dialog/Dialog.jsx', import.meta.url), {
      title: 'Details',
      variant,
      open: false
    });
    assert.equal(html, '');
  }
});

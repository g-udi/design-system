import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Tooltip preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./Tooltip.jsx', import.meta.url),
    { content: 'Supplementary explanation' }
  );
  assert.equal(html, '');
});

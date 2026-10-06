import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Tooltip preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/Tooltip/Tooltip.jsx', import.meta.url),
    { content: 'Supplementary explanation' }
  );
  assert.equal(html, '');
});

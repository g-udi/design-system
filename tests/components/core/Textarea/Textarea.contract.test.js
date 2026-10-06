import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Textarea preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/Textarea/Textarea.jsx', import.meta.url),
    { name: 'summary', rows: 5, maxLength: 100, 'aria-label': 'Summary' }
  );
  assert.match(html, /<textarea/);
  assert.match(html, /rows="5"/);
  assert.match(html, /maxLength="100"/);
});

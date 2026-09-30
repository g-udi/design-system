import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('StatGroup preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./StatGroup.jsx', import.meta.url),
    {
      items: [
        { id: 'a', label: 'Subscribers', value: '—', detail: 'Unavailable' }
      ]
    }
  );
  assert.match(html, /<dl/);
  assert.match(html, /<dt/);
  assert.match(html, /Unavailable/);
  assert.match(html, /—/);
});

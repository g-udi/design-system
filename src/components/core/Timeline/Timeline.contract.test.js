import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Timeline preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./Timeline.jsx', import.meta.url),
    {
      label: 'History',
      items: [
        { id: 'a', title: 'Published', time: 'Today', dateTime: '2026-09-29' }
      ]
    }
  );
  assert.match(html, /<ol/);
  assert.match(html, /aria-label="History"/);
  assert.match(html, /<time dateTime="2026-09-29"/);
});

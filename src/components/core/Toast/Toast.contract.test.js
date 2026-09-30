import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Toast preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./Toast.jsx', import.meta.url),
    {}
  );
  assert.match(html, /Notifications/);
});

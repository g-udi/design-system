import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('AppShell preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./AppShell.jsx', import.meta.url),
    { brand: 'Notebook', navigation: 'Navigation links', children: 'Content' }
  );
  assert.match(html, /<main/);
  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Workspace navigation"/);
});

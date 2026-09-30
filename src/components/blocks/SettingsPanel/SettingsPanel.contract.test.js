import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('SettingsPanel preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./SettingsPanel.jsx', import.meta.url),
    { title: 'Profile', description: 'Your identity', children: 'Fields' }
  );
  assert.match(html, /<section aria-labelledby=/);
  assert.match(html, /<h2/);
  assert.match(html, /Fields/);
});

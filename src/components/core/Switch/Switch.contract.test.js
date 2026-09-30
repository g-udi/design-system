import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Switch renders the composition part with a label that targets it', async () => {
  const html = await renderComponent(new URL('./Switch.jsx', import.meta.url), {
    id: 'setting',
    label: 'Email notifications',
    defaultChecked: true
  });
  assert.match(html, /role="switch"/);
  assert.match(html, /id="setting"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /<label[^>]*for="setting"[^>]*>Email notifications</);
});

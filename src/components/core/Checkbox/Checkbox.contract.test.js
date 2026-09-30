import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Checkbox renders the composition part with a label that targets it', async () => {
  const html = await renderComponent(new URL('./Checkbox.jsx', import.meta.url), {
    id: 'setting',
    label: 'Remember this device',
    defaultChecked: true
  });
  assert.match(html, /role="checkbox"/);
  assert.match(html, /id="setting"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /<label[^>]*for="setting"[^>]*>Remember this device</);
});

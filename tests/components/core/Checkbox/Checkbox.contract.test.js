import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Checkbox renders the composition part with a label that targets it', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Checkbox/Checkbox.jsx', import.meta.url), {
    id: 'setting',
    label: 'Remember this device',
    defaultChecked: true
  });
  assert.match(html, /role="checkbox"/);
  assert.match(html, /id="setting"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /<label[^>]*for="setting"[^>]*>Remember this device</);
});

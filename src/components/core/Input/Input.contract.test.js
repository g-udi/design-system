import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Input preserves its server-rendered public contract', async () => {
  const html = await renderComponent(new URL('./Input.jsx', import.meta.url), {
    name: 'email',
    type: 'email',
    required: true,
    'aria-label': 'Email'
  });
  assert.match(html, /type="email"/);
  assert.match(html, /name="email"/);
  assert.match(html, /required=""/);
  assert.match(html, /aria-label="Email"/);
});

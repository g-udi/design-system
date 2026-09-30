import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('AuthForm preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./AuthForm.jsx', import.meta.url),
    { title: 'Sign in', mode: 'email' }
  );
  assert.match(html, /<form/);
  assert.match(html, /type="email"/);
  assert.match(html, /autoComplete="email"/);
});

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

test('AuthForm exposes placeholders, a configurable password hint and pending label', async () => {
  const url = new URL('./AuthForm.jsx', import.meta.url);
  const defaults = await renderComponent(url, { title: 'Sign in' });
  assert.match(defaults, /Use the password for your account\./);
  assert.doesNotMatch(defaults, /placeholder=/);

  const custom = await renderComponent(url, {
    title: 'Sign in',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'Your password',
    passwordHint: 'At least 12 characters.',
    pendingLabel: 'Sending…'
  });
  assert.match(custom, /type="email"[^>]*placeholder="you@example\.com"/);
  assert.match(custom, /type="password"[^>]*placeholder="Your password"/);
  assert.match(custom, /At least 12 characters\./);
  assert.doesNotMatch(custom, /Use the password for your account/);

  const hidden = await renderComponent(url, { title: 'Sign in', passwordHint: false });
  assert.doesNotMatch(hidden, /Use the password for your account/);

  const { readFile } = await import('node:fs/promises');
  const source = await readFile(url, 'utf8');
  assert.match(source, /pendingLabel = 'Signing in…'/);
  assert.match(source, /\{pending \? pendingLabel : submitLabel\}/);
});

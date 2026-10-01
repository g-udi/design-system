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
  assert.match(source, /password: 'Signing in…'/);
  assert.match(source, /\{pending && !provider \? pendingLabel : submitLabel\}/);
});

test('AuthForm links the revealable password to its label and hint, and hides the hint on request', async () => {
  const html = await renderComponent(new URL('./AuthForm.jsx', import.meta.url), { mode: 'password', passwordPlaceholder: 'Your password' });
  const id = html.match(/<label[^>]*for="([^"]+)"[^>]*>Password<\/label>/)?.[1];
  assert.ok(id, 'password label has a for attribute');
  assert.match(html, new RegExp(`<input[^>]*id="${id}"[^>]*aria-describedby="[^"]+-hint"[^>]*type="password"`));
  assert.match(html, /placeholder="Your password"/);
  assert.match(html, /Use the password for your account\./);
  const hidden = await renderComponent(new URL('./AuthForm.jsx', import.meta.url), { mode: 'password', passwordHint: false });
  assert.doesNotMatch(hidden, /Use the password for your account\./);
  assert.doesNotMatch(hidden, /aria-describedby="[^"]+-hint"/);
});

test('AuthForm renders provider buttons, a username identifier and extra fields', async () => {
  const html = await renderComponent(new URL('./AuthForm.jsx', import.meta.url), {
    identifier: 'username',
    emailLabel: 'Email or username',
    emailPlaceholder: 'you@example.com',
    providers: [{ id: 'google', label: 'Google' }, { id: 'github', label: 'GitHub' }],
    dividerLabel: 'or',
    pendingLabel: 'Checking…'
  });
  assert.match(html, /data-slot="auth-providers"/);
  assert.equal(html.match(/<button[^>]*type="button"[^>]*>(Google|GitHub)<\/button>/g)?.length, 2);
  assert.match(html, /name="username"[^>]*autoComplete="username"|autoComplete="username"[^>]*name="username"/);
  assert.match(html, /placeholder="you@example.com"/);
  const signup = await renderComponent(new URL('./AuthForm.jsx', import.meta.url), { mode: 'signup' });
  assert.match(signup, /autoComplete="new-password"/);
  assert.match(signup, /minLength="8"/);
  assert.match(signup, /At least 8 characters\./);
});

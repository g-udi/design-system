import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('the theme switch has a stable, disabled server state until the client resolves its theme', async () => {
  const html = await renderComponent(new URL('../../../../src/components/blocks/Navigation/ThemeSwitch.jsx', import.meta.url));
  assert.match(html, /<button[^>]*type="button"/);
  assert.match(html, /aria-label="Toggle Dark Mode"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /disabled=""/);
  assert.equal((html.match(/<button/g) || []).length, 1);
});

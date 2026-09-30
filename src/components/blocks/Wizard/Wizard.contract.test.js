import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Wizard preserves its server-rendered public contract', async () => {
  const html = await renderComponent(new URL('./Wizard.jsx', import.meta.url), {
    title: 'Setup',
    steps: [],
    onComplete: () => {}
  });
  assert.equal(html, '');
});

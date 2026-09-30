import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Stepper preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./Stepper.jsx', import.meta.url),
    {
      activeStep: 1,
      steps: [
        { id: 'a', label: 'Details' },
        { id: 'b', label: 'Review' }
      ]
    }
  );
  assert.match(html, /aria-current="step"/);
  assert.match(html, /Completed/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Stepper preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/Stepper/Stepper.jsx', import.meta.url),
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

test('Stepper turns only completed steps into buttons when onStepSelect is set', async () => {
  const steps = [
    { id: 'a', label: 'Details' },
    { id: 'b', label: 'Billing' },
    { id: 'c', label: 'Review' }
  ];
  const html = await renderComponent(new URL('../../../../src/components/core/Stepper/Stepper.jsx', import.meta.url), { activeStep: 2, steps, orientation: 'vertical', onStepSelect: () => {} });
  assert.equal(html.match(/<button/g)?.length, 2);
  assert.match(html, /<button[^>]*>Details<\/button>/);
  assert.doesNotMatch(html, /<button[^>]*>Review<\/button>/);
  const readOnly = await renderComponent(new URL('../../../../src/components/core/Stepper/Stepper.jsx', import.meta.url), { activeStep: 2, steps });
  assert.doesNotMatch(readOnly, /<button/);
});

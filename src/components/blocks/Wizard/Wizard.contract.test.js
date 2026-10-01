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

const steps = [
  { id: 'plan', label: 'Plan' },
  { id: 'pay', label: 'Payment' },
  { id: 'review', label: 'Review' }
];

test('Wizard renders dots, progress and vertical indicators with the step announced', async () => {
  const dots = await renderComponent(new URL('./Wizard.jsx', import.meta.url), { title: 'Upgrade', steps, indicator: 'dots', navigable: true, onComplete: () => {} });
  assert.match(dots, /data-slot="wizard-dots"/);
  assert.match(dots, /aria-label="Step 1 of 3"/);
  assert.equal(dots.match(/aria-current="step"/g)?.length, 1);
  const progress = await renderComponent(new URL('./Wizard.jsx', import.meta.url), { title: 'Upgrade', steps, indicator: 'progress', onComplete: () => {} });
  assert.match(progress, /data-slot="wizard-progress"/);
  assert.match(progress, /Step 1 of 3/);
  const vertical = await renderComponent(new URL('./Wizard.jsx', import.meta.url), { title: 'Upgrade', steps, indicator: 'vertical', aside: 'Invoice preview', onComplete: () => {} });
  assert.match(vertical, /data-orientation="vertical"/);
  assert.match(vertical, /<aside[^>]*>Invoice preview<\/aside>/);
});

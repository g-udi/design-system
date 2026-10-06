import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

test('Progress preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/core/Progress/Progress.jsx', import.meta.url),
    { label: 'Upload', value: 150, max: 100 }
  );
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuenow="100"/);
  assert.match(html, /aria-valuemax="100"/);
  assert.match(html, /aria-labelledby="[^"]+"/);
});

import { loadComponent } from '../../../support/renderComponent.js';
test('non-finite progress stays indeterminate and invalid maxima use a safe range', async () => {
  const { normalizeProgress } = await loadComponent(
    new URL('../../../../src/components/core/Progress/Progress.jsx', import.meta.url)
  );
  assert.deepEqual(normalizeProgress(NaN), { value: undefined, max: 100 });
  assert.deepEqual(normalizeProgress(-5, 0), { value: 0, max: 100 });
  assert.deepEqual(normalizeProgress(250, 200), { value: 200, max: 200 });
});

test('an indeterminate composition bar stays visible for its CSS animation', async () => {
  const { Progress } = await loadComponent(new URL('../../../../src/components/core/Progress/ProgressPrimitives.jsx', import.meta.url));
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(createElement(Progress));
  assert.match(html, /data-slot="progress-indicator"[^>]*data-state="indeterminate"|data-state="indeterminate"[^>]*data-slot="progress-indicator"/);
  // A translateX(-100%) offset would push the bar out of view.
  assert.doesNotMatch(html, /translateX\(-100%\)/);
});

test('ProgressRing clamps its value and exposes progressbar semantics', async () => {
  const { ProgressRing } = await loadComponent(new URL('../../../../src/components/core/Progress/ProgressRing.jsx', import.meta.url));
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(createElement(ProgressRing, { value: 140, label: 'Upload', tone: 'success', size: 'md', showValue: true }));
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-label="Upload"/);
  assert.match(html, /aria-valuenow="100"/);
  assert.match(html, /aria-valuetext="100%"/);
  assert.match(html, /data-tone="success"/);
  const small = renderToStaticMarkup(createElement(ProgressRing, { value: 30, size: 'xs', showValue: true }));
  assert.doesNotMatch(small, />30</, 'xs rings are too small to print the value');
});

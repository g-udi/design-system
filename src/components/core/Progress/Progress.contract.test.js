import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Progress preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./Progress.jsx', import.meta.url),
    { label: 'Upload', value: 150, max: 100 }
  );
  assert.match(html, /<progress/);
  assert.match(html, /value="100"/);
  assert.match(html, /max="100"/);
});

import { loadComponent } from '../../../test-support/renderComponent.js';
test('non-finite progress stays indeterminate and invalid maxima use a safe range', async () => {
  const { normalizeProgress } = await loadComponent(
    new URL('./Progress.jsx', import.meta.url)
  );
  assert.deepEqual(normalizeProgress(NaN), { value: undefined, max: 100 });
  assert.deepEqual(normalizeProgress(-5, 0), { value: 0, max: 100 });
  assert.deepEqual(normalizeProgress(250, 200), { value: 200, max: 200 });
});

test('an indeterminate composition bar stays visible for its CSS animation', async () => {
  const { Progress } = await loadComponent(new URL('./parts/progress.jsx', import.meta.url));
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(createElement(Progress));
  assert.match(html, /data-slot="progress-indicator"[^>]*data-state="indeterminate"|data-state="indeterminate"[^>]*data-slot="progress-indicator"/);
  // A translateX(-100%) offset would push the bar out of view.
  assert.doesNotMatch(html, /translateX\(-100%\)/);
});

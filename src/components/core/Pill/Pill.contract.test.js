import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../test-support/renderComponent.js';

test('Pill renders a labelled badge element', async () => {
  const html = await renderComponent(new URL('./Pill.jsx', import.meta.url), { children: 'Live', tone: 'green' });
  assert.match(html, /data-slot="badge"/);
  assert.match(html, />Live</);
});

test('Badge exposes discovery and attention variants alongside info and success', async () => {
  const { badgeVariants } = await loadComponent(new URL('./parts/badge-extended.jsx', import.meta.url));
  const classes = (name) => badgeVariants({ variant: name });
  assert.match(classes('discovery'), /bg-discovery text-discovery-foreground/);
  assert.match(classes('attention'), /bg-attention text-attention-foreground/);
  assert.match(classes('discovery-light'), /bg-discovery\/10 .*text-ui-discovery-ink/);
  assert.match(classes('attention-light'), /bg-attention\/10 .*text-ui-attention-ink/);
  assert.match(classes('discovery-outline'), /text-ui-discovery-ink/);
  assert.match(classes('attention-outline'), /text-ui-attention-ink/);
  // Same solid/light/outline shape as the existing semantic tones.
  for (const tone of ['info', 'success', 'discovery', 'attention']) {
    assert.ok(classes(`${tone}-light`).includes(`border-${tone}/15`), tone);
  }

  const { readFile } = await import('node:fs/promises');
  const css = await readFile(new URL('../../../composition.css', import.meta.url), 'utf8');
  assert.match(css, /--color-ui-discovery-ink: color-mix\(\s*in srgb,\s*var\(--ds-color-discovery\)/);
  assert.match(css, /--color-ui-attention-ink: color-mix\(\s*in srgb,\s*var\(--ds-color-attention\)/);
});

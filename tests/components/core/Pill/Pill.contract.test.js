import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

test('Pill renders a labelled badge element', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Pill/Pill.jsx', import.meta.url), { children: 'Live', tone: 'green' });
  assert.match(html, /data-slot="badge"/);
  assert.match(html, />Live</);
});

test('Pill carries no outer margin, so layouts own the spacing between pills', async () => {
  const { pillVariants } = await loadComponent(new URL('../../../../src/components/core/Pill/Pill.jsx', import.meta.url));
  for (const size of [ 'xs', 'sm', 'md', 'lg' ]) assert.doesNotMatch(pillVariants({ size }), /(?:^|\s)-?m[trblxy]?-/);
});

test('Badge exposes discovery and attention variants alongside info and success', async () => {
  const { badgeVariants } = await loadComponent(new URL('../../../../src/components/core/Pill/Badge.jsx', import.meta.url));
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
  const css = await readFile(new URL('../../../../src/tokens/theme.css', import.meta.url), 'utf8');
  assert.match(css, /--color-ui-discovery-ink: color-mix\(\s*in srgb,\s*var\(--ds-color-discovery\)/);
  assert.match(css, /--color-ui-attention-ink: color-mix\(\s*in srgb,\s*var\(--ds-color-attention\)/);
});


test('Pill links reuse safe navigation and external target behavior', async () => {
  const html = await renderComponent(new URL('../../../../src/components/core/Pill/Pill.jsx', import.meta.url), { children: 'Docs', href: 'https://example.com/docs' });
  assert.match(html, /href="https:\/\/example.com\/docs"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  const unsafe = await renderComponent(new URL('../../../../src/components/core/Pill/Pill.jsx', import.meta.url), { children: 'Invalid', href: 'javascript:alert(1)' });
  assert.doesNotMatch(unsafe, /javascript:/);
  assert.doesNotMatch(unsafe, /<a\b/);
});

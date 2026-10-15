import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const url = new URL('../../../../src/components/layout/PageHeader/index.js', import.meta.url);

test('PageHeader renders a header with an h1 title by default and omits empty slots', async () => {
  const html = await renderComponent(url, { title: 'Projects' });
  assert.match(html, /^<header data-slot="page-header" class="[^"]*pb-4/);
  assert.match(html, /<h1 class="[^"]*">Projects<\/h1>/);
  assert.doesNotMatch(html, /page-header-actions|uppercase|border-b|sticky/);
});

test('eyebrow, description, actions, heading level and id compose in reading order', async () => {
  const html = await renderComponent(url, { eyebrow: 'Archive', title: 'All posts', titleAs: 'h2', titleId: 'all-posts', titleVariant: 'heading-lg', description: 'Newest first.', actions: '42 posts' });
  const order = [ 'Archive', 'All posts', 'Newest first.', '42 posts' ].map((text) => html.indexOf(`>${text}<`));
  assert.deepEqual([ ...order ].sort((a, b) => a - b), order);
  assert.ok(order.every((index) => index > 0));
  assert.match(html, /<h2 class="[^"]*text-3xl[^"]*" id="all-posts">/);
  assert.match(html, /data-slot="page-header-actions"/);
});

test('sticky pins on the page background with a token border; divider adds only the border', async () => {
  const sticky = await renderComponent(url, { title: 'All posts', sticky: true });
  assert.match(sticky, /data-sticky=""/);
  for (const token of [ 'sticky', 'top-0', 'bg-background', 'border-b', 'border-border' ]) assert.match(sticky, new RegExp(`class="[^"]*(?:^|\\s|")${token}(?:\\s|")`));
  const divider = await renderComponent(url, { title: 'Tags', divider: true });
  assert.match(divider, /border-b border-border/);
  assert.doesNotMatch(divider, /sticky|bg-background/);
  for (const html of [ sticky, divider ]) assert.doesNotMatch(html, /\b(?:border|divide|bg)-(?:gray|slate|zinc|neutral)-\d/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../support/renderComponent.js';

const url = new URL('../../../src/foundations/Typography/Typography.jsx', import.meta.url);
const { typographyVariants } = await loadComponent(url);
const size = (variant) => Number(typographyVariants[variant].className.match(/(?:^|\s)text-\[(\d+)px\]/)?.[1] ?? { 'xs': 12, 'sm': 14, 'base': 16, 'lg': 18, 'xl': 20 }[typographyVariants[variant].className.match(/(?:^|\s)text-(xs|sm|base|lg|xl)(?:\s|$)/)?.[1]]);

test('the compact scale reaches below heading-sm and metadata', () => {
  assert.ok(size('heading-xs') < size('heading-sm'), 'heading-xs is smaller than heading-sm');
  assert.match(typographyVariants['heading-xs'].className, /font-semibold/);
  assert.ok(size('caption') < size('metadata'), 'caption is smaller than metadata');
  assert.match(typographyVariants.caption.className, /text-text-muted/);
  assert.equal(typographyVariants['paragraph-base'].className, 'text-base leading-7 text-text-muted');
});

test('new variants render their semantic default element and accept as', async () => {
  assert.match(await renderComponent(url, { variant: 'heading-xs', children: 'Card' }), /^<h5 /);
  assert.match(await renderComponent(url, { variant: 'caption', children: 'Updated' }), /^<span /);
  assert.match(await renderComponent(url, { variant: 'heading-xs', as: 'h3', children: 'Card' }), /^<h3 /);
});

test('every variant uses semantic text tokens, never raw palette colours', () => {
  for (const [ variant, { className } ] of Object.entries(typographyVariants)) {
    assert.doesNotMatch(className, /\btext-(?:gray|slate|zinc|neutral|stone)-\d/, variant);
  }
});

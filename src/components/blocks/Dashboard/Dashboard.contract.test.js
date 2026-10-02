import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const day = (value) => `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
const today = new Date(2026, 9, 1);

test('resolveDashboardPeriod covers the preset ending today and the equally long period before it', () => {
  const week = api.resolveDashboardPeriod('7d', { today });
  assert.equal(week.days, 7);
  assert.equal(day(week.from), '2026-9-25');
  assert.equal(day(week.to), '2026-10-1');
  assert.equal(day(week.previous.to), '2026-9-24');
  assert.equal(day(week.previous.from), '2026-9-18');
  const year = api.resolveDashboardPeriod('12m', { today });
  assert.equal(day(year.from), '2025-10-2');
  const custom = api.resolveDashboardPeriod('custom', { today, range: { from: new Date(2026, 8, 10), to: new Date(2026, 8, 1) } });
  assert.equal(custom.days, 10, 'reversed ranges are put in order');
  assert.equal(day(custom.previous.to), '2026-8-31');
  // Unknown periods fall back to the first preset.
  assert.equal(api.resolveDashboardPeriod('nope', { today }).days, 7);
});

test('dashboardSpan places children on the twelve and six column grids', () => {
  assert.match(api.dashboardSpan(3), /@2xl\/dashboard:col-span-3/);
  assert.match(api.dashboardSpan(3), /@5xl\/dashboard:col-span-3/);
  assert.match(api.dashboardSpan(8), /@2xl\/dashboard:col-span-6/);
  const placed = api.dashboardSpan(8, 4, 2);
  assert.match(placed, /@2xl\/dashboard:col-span-4/);
  assert.match(placed, /@5xl\/dashboard:col-span-8/);
  assert.match(placed, /@5xl\/dashboard:row-span-2/);
});

test('DashboardPanel names its region and makes a scrolling body focusable', () => {
  const html = renderToStaticMarkup(h(api.DashboardPanel, { title: 'Order queue', scroll: 'x', span: 8 }, h('table')));
  const id = html.match(/aria-labelledby="([^"]+)"/)?.[1];
  assert.ok(id, 'the region is labelled by its title');
  assert.match(html, new RegExp(`<h3[^>]*id="${id}"[^>]*>Order queue</h3>`));
  assert.match(html, /tabindex="0"/i);
  assert.match(html, /overflow-x-auto/);
});

test('DashboardToolbar summarises the active range, with the comparison when on', () => {
  const html = renderToStaticMarkup(h(api.DashboardToolbar, { today, defaultPeriod: '7d', defaultCompare: true }));
  assert.match(html, /Showing Sep 25, 2026 – Oct 1, 2026, compared with Sep 18, 2026 – Sep 24, 2026/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="Period"/);
});

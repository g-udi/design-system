import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { StatCard, StatDelta, StatMeter } = await loadComponent(new URL('../../../../src/components/blocks/StatCard/StatCard.jsx', import.meta.url));

test('metric changes preserve signs and zero without inferring direction or meaning', () => {
  for (const value of [0, '+0.00%', '-0.5%', '−0,05', '5.3%']) {
    const html = renderToStaticMarkup(createElement(StatDelta, { value }));
    assert.ok(html.includes(String(value)), `preserves ${value}`);
    assert.doesNotMatch(html, /data-trend=|lucide-trending|success-light|destructive-light/);
  }
});

test('direction and tone are independent host choices on badges and cards', () => {
  const badge = renderToStaticMarkup(createElement(StatDelta, { value: '-0.5%', direction: 'down', tone: 'success' }));
  assert.match(badge, /data-trend="down"/);
  assert.match(badge, /success-light/);
  assert.ok(badge.includes('-0.5%'));
  const card = renderToStaticMarkup(createElement(StatCard, { label: 'Errors', value: 0, delta: 0, deltaDirection: 'flat', deltaTone: 'neutral' }));
  assert.match(card, /data-trend="flat"/);
  assert.match(card, /Unchanged/);
  assert.match(card, /data-slot="stat-value"[^>]*>0</);
});


test('a visually hidden meter legend keeps its values available to assistive technology', () => {
  const html = renderToStaticMarkup(createElement(StatMeter, { showLegend: false, segments: [{ label: 'Completed', value: 7, tone: 'success' }, { label: 'Remaining', value: 3 }] }));
  assert.match(html, /<dl class="[^"]*sr-only/);
  assert.match(html, />Completed<\/dt>/);
  assert.match(html, />7<span/);
  assert.match(html, />70%<\/span>/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/charts/RadialChart/index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
/** A chart that rendered its plot: ready, one named tab stop, the keyboard hint and the table mirror. */
const assertFramed = (html, name) => {
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${name} renders ready`);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${name} plot is one tab stop`);
  assert.match(html, new RegExp(`aria-label="${name}"`), `${name} plot is named`);
  assert.match(html, /aria-roledescription="chart"/);
  assert.match(html, /data-slot="chart-data-table"/, `${name} mirrors its data in a table`);
};

test('RadialBarChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.RadialBarChart, { ariaLabel: 'RadialBarChart', ...{ data: [{ label: 'Done', value: 78 }] } }), 'RadialBarChart');
  assert.equal(api.default, api.RadialBarChart, 'the owner default is the chart');
});

test('values read as percentages', () => {
  assert.match(render(api.RadialBarChart, { ariaLabel: 'Done', data: [{ label: 'Done', value: 78 }] }), />78%</);
});


test('fractional percentages follow locale without changing the 0–100 value contract', () => {
  const data = [{ label: 'Done', value: 78.25 }];
  assert.match(render(api.RadialBarChart, { data, locale: 'en-US' }), />78\.25%</);
  assert.match(render(api.RadialBarChart, { data, locale: 'de-DE' }), />78,25\s%</);
  assert.match(render(api.RadialBarChart, { data, locale: 'de-DE', formatValue: value => `${value} points` }), />78\.25 points</);
  assert.match(render(api.RadialBarChart, { data, locale: 'de-DE', formatValue: { minimumFractionDigits: 1 } }), />78,25</);
});

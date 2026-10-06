import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const frame = await loadComponent(new URL('../../../../src/components/charts/ChartFrame/index.js', import.meta.url));
const charts = await loadComponent(new URL('../../../../src/components/charts/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(createElement(Component, props, ...children));
const readers = [{ label: 'Jan', search: 1840, social: 610 }, { label: 'Feb', search: 2110, social: 480 }];
const points = [{ label: 'Essays', values: [{ name: 'Done', value: 18 }, { name: 'Target', value: 24 }] }];

test('ChartFrame frames a custom visual: one named tab stop, the keyboard hint and a table from points', () => {
  const html = render(frame.ChartFrame, { ariaLabel: 'Writing goals', points, title: 'Writing goals' }, createElement('svg', { 'data-chart-index': 0 }));
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/);
  assert.match(html, /aria-label="Writing goals"/);
  assert.match(html, /Use the arrow keys/);
  assert.match(html, /scope="row"[^>]*>Essays</);
  assert.equal(frame.default, frame.ChartFrame);
});

test('charts show loading, empty, invalid and error states instead of a plot', () => {
  assert.match(render(charts.BarChart, { data: readers, state: 'loading', yKey: 'search' }), /aria-busy="true"[\s\S]*data-state="loading"[\s\S]*Loading chart/);
  assert.match(render(charts.LineChart, { data: [] }), /data-state="empty"[\s\S]*No data to show yet/);
  assert.match(render(charts.BarChart, { data: [{ label: 'Jan', value: 'many' }] }), /data-state="invalid"[\s\S]*role="alert"/);
  assert.match(render(frame.ChartFrame, { points, status: 'error' }), /This chart could not load/);
  assert.doesNotMatch(render(frame.ChartFrame, { points: [], status: 'ready' }), /tabindex="0"/, 'an empty frame is not a tab stop');
});

test('values follow the locale and number format in the data table', () => {
  const html = render(charts.BarChart, { data: [{ label: 'Q1', value: 1234567.5 }], formatValue: { maximumFractionDigits: 1 }, locale: 'de-DE' });
  assert.match(html, /1\.234\.567,5/);
  const table = render(frame.ChartDataTable, { caption: 'Goals', format: frame.createChartFormatter('en-US', { maximumFractionDigits: 0 }), points });
  assert.match(table, /<caption[^>]*>Goals<\/caption>/);
  assert.match(table, />24</);
});

test('the data table can be shown with a toggle or always', () => {
  const toggle = render(charts.AreaChart, { data: readers, showData: 'toggle', title: 'Readers', yKey: 'search' });
  assert.match(toggle, /aria-expanded="false"[^>]*>Show data</);
  // Hidden, the table sits in a visually hidden box; shown, in a focusable scroll region.
  assert.match(toggle, /<div class="sr-only"><table[^>]*data-slot="chart-data-table"/);
  const visible = render(charts.AreaChart, { data: readers, showData: 'visible', yKey: 'search' });
  assert.doesNotMatch(visible, /<div class="sr-only"><table/);
  assert.match(visible, /role="region"[^>]*tabindex="0"[^>]*><table|tabindex="0"[^>]*role="region"[^>]*><table|role="region" tabindex="0"><table/);
});

test('scale helpers give round ticks, quartiles and groupings', () => {
  assert.deepEqual(frame.niceTicks(3, 97, 5), [ 0, 20, 40, 60, 80, 100 ]);
  assert.deepEqual(frame.niceTicks(0.1, 0.3, 2), [ 0.1, 0.2, 0.3 ], 'no floating-point noise such as 0.30000000000000004');
  const stats = frame.boxStats([ 1, 2, 3, 4, 5, 6, 7, 8, 100 ]);
  assert.equal(stats.median, 5);
  assert.deepEqual(stats.outliers, [ 100 ]);
  assert.equal(stats.max, 8);
  const grouped = frame.groupSmallSlices([{ n: 'a', v: 10 }, { n: 'b', v: 1 }, { n: 'c', v: 1 }], { nameKey: 'n', threshold: 0.2, valueKey: 'v' });
  assert.deepEqual(grouped.map((item) => item.n), [ 'a', 'Other' ]);
  assert.equal(frame.dataStatus([{ value: Number.NaN }], [ 'value' ]), 'invalid');
  assert.equal(frame.dataStatus([{ value: null }], [ 'value' ]), 'empty');
  assert.equal(frame.chartColors.length, 8);
  assert.equal(frame.getChartColor([ 'red' ], 0), 'red');
});

test('tick generation terminates and preserves finite values at floating-point limits', () => {
  const moduleUrl = new URL('../../../../src/components/charts/ChartFrame/chartScale.js', import.meta.url);
  const code = `
    import { niceTicks } from ${JSON.stringify(moduleUrl.href)};
    const ranges = [[1, 1 + Number.EPSILON], [1e-300, 2e-300], [Number.MIN_VALUE, Number.MIN_VALUE], [1e308, 1.7e308], [Number.MAX_VALUE, Number.MAX_VALUE]];
    console.log(JSON.stringify(ranges.map(([min, max]) => ({ min, max, ticks: niceTicks(min, max) }))));
  `;
  // A separate process bounds a regression to the formerly non-advancing loop.
  const results = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', timeout: 2000 }));
  for (const { min, max, ticks } of results) {
    assert.ok(ticks.length >= 2 && ticks.every(Number.isFinite));
    assert.ok(ticks[0] <= min && ticks.at(-1) >= max);
    assert.ok(ticks.every((tick, index) => index === 0 || tick > ticks[index - 1]));
  }
});


test('malformed chart records show the shared invalid state instead of throwing while deriving points', () => {
  for (const name of ['AreaChart', 'BarChart', 'LineChart', 'ComposedChart', 'DonutChart', 'BoxPlotChart', 'HeatmapChart', 'RadialBarChart', 'RangeChart', 'ScatterChart', 'Sparkline', 'StackedBarList', 'TreemapChart', 'WaterfallChart']) {
    assert.match(render(charts[name], { data: [null] }), /data-state="invalid"/, name);
  }
});

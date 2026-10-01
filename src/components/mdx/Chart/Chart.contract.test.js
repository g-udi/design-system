import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const chart = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
const readers = [{ label: 'Jan', search: 1840, social: 610 }, { label: 'Feb', search: 2110, social: 480 }];

test('every chart type renders a labelled plot, a keyboard hint and a data table mirror', () => {
  const cases = {
    'area': { data: readers, series: [{ key: 'search', label: 'Search' }] },
    'bar': { data: readers, series: [{ key: 'search', label: 'Search' }, { key: 'social', label: 'Social' }] },
    'bar-list': { data: [{ label: 'Essays', search: 30, social: 12 }], series: [{ key: 'search' }, { key: 'social' }] },
    'box-plot': { data: [{ label: '/blog', values: [ 120, 180, 210, 260, 900 ] }] },
    'bubble': { data: [{ label: 'A', x: 1, y: 2, z: 30 }] },
    'composed': { data: [{ label: 'Mon', views: 10, readTime: 4 }] },
    'donut': { data: [{ label: 'Data', value: 3 }, { label: 'Design', value: 1 }] },
    'funnel': { data: [{ label: 'Visited', value: 1000 }, { label: 'Subscribed', value: 120 }] },
    'gauge': { value: 72 },
    'heatmap': { data: [{ x: '09:00', y: 'Mon', value: 3 }, { x: '10:00', y: 'Mon', value: 5 }] },
    'histogram': { values: [ 1, 2, 2, 3, 5, 8 ] },
    'line': { data: readers, yKey: 'search' },
    'pie': { data: [ 4, 6 ] },
    'radial': { data: [{ label: 'Done', value: 78 }] },
    'range': { data: [{ label: 'W1', low: 1, high: 3, value: 2 }] },
    'sankey': { links: [{ source: 'Search', target: 'Essay', value: 40 }] },
    'scatter': { data: [{ x: 800, y: 4 }] },
    'sparkline': { data: [ 3, 5, 4, 7 ] },
    'treemap': { data: [{ name: 'Posts', value: 40 }, { name: 'Drafts', value: 12 }] },
    'waterfall': { data: [{ label: 'Start', value: 100 }, { label: 'Churn', value: -20 }, { label: 'End', total: true }] }
  };
  assert.deepEqual([ ...chart.CHART_TYPES ].sort(), Object.keys(cases).sort(), 'every type the switch accepts is covered');
  for (const [ type, props ] of Object.entries(cases)) {
    const html = render(chart.Chart, { ariaLabel: `${type} chart`, type, ...props });
    assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${type} renders ready`);
    assert.match(html, new RegExp(`role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"`), `${type} plot is one tab stop`);
    assert.match(html, new RegExp(`aria-label="${type} chart"`), `${type} plot is named`);
    assert.match(html, /aria-roledescription="chart"/, `${type} plot describes itself`);
    assert.match(html, /Use the arrow keys/, `${type} explains the keys`);
    assert.match(html, /data-slot="chart-data-table"/, `${type} mirrors its data in a table`);
  }
});

test('charts show loading, empty, invalid and error states instead of a plot', () => {
  assert.match(render(chart.BarChart, { data: readers, state: 'loading', yKey: 'search' }), /aria-busy="true"[\s\S]*data-state="loading"[\s\S]*Loading chart/);
  assert.match(render(chart.LineChart, { data: [] }), /data-state="empty"[\s\S]*No data to show yet/);
  assert.match(render(chart.BarChart, { data: [{ label: 'Jan', value: 'many' }] }), /data-state="invalid"[\s\S]*role="alert"/);
  assert.match(render(chart.GaugeChart, { state: 'error', value: 3 }), /This chart could not load/);
  const custom = render(chart.FunnelChart, { data: [], labels: { empty: 'Nobody has signed up yet.' } });
  assert.match(custom, /Nobody has signed up yet\./);
  assert.doesNotMatch(custom, /tabindex="0"/, 'an empty chart is not a tab stop');
});

test('values follow the locale and number format in the data table', () => {
  const html = render(chart.BarChart, { data: [{ label: 'Q1', value: 1234567.5 }], formatValue: { maximumFractionDigits: 1 }, locale: 'de-DE' });
  assert.match(html, /1\.234\.567,5/);
  const currency = render(chart.WaterfallChart, { data: [{ label: 'Start', value: 1200 }, { label: 'End', total: true }], formatValue: { currency: 'EUR', style: 'currency' }, locale: 'en-GB' });
  assert.match(currency, /€1,200\.00/);
});

test('the data table can be shown with a toggle or always', () => {
  const toggle = render(chart.AreaChart, { data: readers, showData: 'toggle', title: 'Readers', yKey: 'search' });
  assert.match(toggle, /aria-expanded="false"[^>]*>Show data</);
  // Hidden, the table sits in a visually hidden box; shown, in a focusable scroll region.
  assert.match(toggle, /<div class="sr-only"><table[^>]*data-slot="chart-data-table"/);
  const visible = render(chart.AreaChart, { data: readers, showData: 'visible', yKey: 'search' });
  assert.doesNotMatch(visible, /<div class="sr-only"><table/);
  assert.match(visible, /role="region"[^>]*tabindex="0"[^>]*><table|tabindex="0"[^>]*role="region"[^>]*><table|role="region" tabindex="0"><table/);
});

test('donuts fold small slices into Other and summarise the total', () => {
  const html = render(chart.DonutChart, { data: [{ label: 'A', value: 90 }, { label: 'B', value: 4 }, { label: 'C', value: 3 }, { label: 'D', value: 3 }], otherThreshold: 0.05 });
  assert.match(html, />Other</);
  assert.match(html, /B, C, D/, 'the table lists what Other holds');
  assert.match(html, /data-slot="chart-center"[\s\S]*>Total</);
});

test('scale helpers give round ticks, bins, quartiles and groupings', () => {
  assert.deepEqual(chart.niceTicks(3, 97, 5), [ 0, 20, 40, 60, 80, 100 ]);
  assert.deepEqual(chart.niceTicks(0.1, 0.3, 2), [ 0.1, 0.2, 0.3 ], 'no floating-point noise such as 0.30000000000000004');
  assert.deepEqual(chart.histogramBins([ 1, 9, 12, 18, 31 ], { bins: 4 }).map((bin) => bin.count), [ 2, 2, 0, 1 ]);
  const stats = chart.boxStats([ 1, 2, 3, 4, 5, 6, 7, 8, 100 ]);
  assert.equal(stats.median, 5);
  assert.deepEqual(stats.outliers, [ 100 ]);
  assert.equal(stats.max, 8);
  const grouped = chart.groupSmallSlices([{ n: 'a', v: 10 }, { n: 'b', v: 1 }, { n: 'c', v: 1 }], { nameKey: 'n', threshold: 0.2, valueKey: 'v' });
  assert.deepEqual(grouped.map((item) => item.n), [ 'a', 'Other' ]);
  assert.deepEqual(chart.waterfallSteps([{ label: 'S', value: 10 }, { label: 'D', value: -4 }, { label: 'T', total: true }]).map((step) => step.range), [[ 0, 10 ], [ 6, 10 ], [ 0, 6 ]]);
  const graph = chart.sankeyGraph({ links: [{ source: 'A', target: 'B', value: 2 }, { source: 'B', target: 'C', value: 1 }] });
  assert.deepEqual(graph.nodes.map((node) => node.name), [ 'A', 'B', 'C' ]);
  assert.deepEqual(graph.links.map((link) => [ link.source, link.target ]), [[ 0, 1 ], [ 1, 2 ]]);
  assert.equal(chart.dataStatus([{ value: Number.NaN }], [ 'value' ]), 'invalid');
  assert.equal(chart.dataStatus([{ value: null }], [ 'value' ]), 'empty');
});

test('heatmaps step values onto the ramp and centre diverging scales', () => {
  assert.equal(chart.heatmapStep(null, { domain: [ 0, 10 ] }).fill, 'var(--ds-color-chart-heat-0)');
  assert.equal(chart.heatmapStep(10, { domain: [ 0, 10 ] }).fill, 'var(--ds-color-chart-heat-5)');
  assert.equal(chart.heatmapStep(0, { domain: [ -5, 5 ], scale: 'diverging' }).fill, 'var(--ds-color-chart-div-mid)');
  assert.equal(chart.heatmapStep(-5, { domain: [ -5, 5 ], scale: 'diverging' }).ink, 'var(--ds-color-chart-div-ink)');
  const html = render(chart.HeatmapChart, { data: [{ x: 'a', y: 'r1', value: 1 }, { x: 'b', y: 'r1', value: 2 }, { x: 'a', y: 'r2', value: 3 }] });
  assert.match(html, /r2 · b/, 'missing cells still appear in the table');
});

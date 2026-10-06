import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const chart = await loadComponent(new URL('../../../../src/components/mdx/Chart/index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
const readers = [{ label: 'Jan', search: 1840, social: 610 }, { label: 'Feb', search: 2110, social: 480 }];

test('the MDX Chart switch renders every chart in the collection with its frame', () => {
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
    'radar': { data: [{ label: 'Clarity', value: 7 }, { label: 'Voice', value: 8 }] },
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
    assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${type} plot is one tab stop`);
    assert.match(html, new RegExp(`aria-label="${type} chart"`), `${type} plot is named`);
    assert.match(html, /data-slot="chart-data-table"/, `${type} mirrors its data in a table`);
  }
});

test('the blog default import still renders a chart from plain numbers', () => {
  assert.match(render(chart.default, { data: [ 1, 2, 3, 4 ] }), /data-slot="chart"[^>]*data-state="ready"/);
});

test('MDX authors get every chart by name, imported from the Charts collection', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../../../../src/components/mdx/index.js', import.meta.url), 'utf8');
  assert.match(source, /from '\.\.\/charts\/index\.js'/, 'the MDX map imports the charts rather than defining them');
  for (const name of [ 'BarChart', 'RadarChart', 'SankeyChart', 'Sparkline', 'DonutChart' ]) assert.match(source, new RegExp(`^  ${name},$`, 'm'), `${name} is in the MDX map`);
});

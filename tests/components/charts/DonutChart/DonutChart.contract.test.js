import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/charts/DonutChart/index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
/** A chart that rendered its plot: ready, one named tab stop, the keyboard hint and the table mirror. */
const assertFramed = (html, name) => {
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${name} renders ready`);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${name} plot is one tab stop`);
  assert.match(html, new RegExp(`aria-label="${name}"`), `${name} plot is named`);
  assert.match(html, /aria-roledescription="chart"/);
  assert.match(html, /data-slot="chart-data-table"/, `${name} mirrors its data in a table`);
};

test('DonutChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.DonutChart, { ariaLabel: 'DonutChart', ...{ data: [{ label: 'Data', value: 3 }, { label: 'Design', value: 1 }] } }), 'DonutChart');
  assert.equal(api.default, api.DonutChart, 'the owner default is the chart');
});

test('donuts fold small slices into Other and preserve the accessible server data', () => {
  const html = render(api.DonutChart, { ariaLabel: 'Topics', data: [{ label: 'A', value: 90 }, { label: 'B', value: 4 }, { label: 'C', value: 3 }, { label: 'D', value: 3 }], otherThreshold: 0.05 });
  assert.match(html, />Other</);
  assert.match(html, /B, C, D/, 'the table lists what Other holds');
  assert.match(html, />90<[^]*>90%<[^]*>Other<[^]*>10<[^]*>10%</, 'server table preserves the full total and shares before Recharts measures its plot');
});

test('a pie draws without a centre summary', () => {
  const html = render(api.PieChart, { ariaLabel: 'Plans', data: [ 4, 6 ] });
  assertFramed(html, 'Plans');
  assert.doesNotMatch(html, /data-slot="chart-center"/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/charts/WaterfallChart/index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
/** A chart that rendered its plot: ready, one named tab stop, the keyboard hint and the table mirror. */
const assertFramed = (html, name) => {
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${name} renders ready`);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${name} plot is one tab stop`);
  assert.match(html, new RegExp(`aria-label="${name}"`), `${name} plot is named`);
  assert.match(html, /aria-roledescription="chart"/);
  assert.match(html, /data-slot="chart-data-table"/, `${name} mirrors its data in a table`);
};

test('WaterfallChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.WaterfallChart, { ariaLabel: 'WaterfallChart', ...{ data: [{ label: 'Start', value: 100 }, { label: 'Churn', value: -20 }, { label: 'End', total: true }] } }), 'WaterfallChart');
  assert.equal(api.default, api.WaterfallChart, 'the owner default is the chart');
});

test('steps carry running ranges and totals', () => {
  assert.deepEqual(api.waterfallSteps([{ label: 'S', value: 10 }, { label: 'D', value: -4 }, { label: 'T', total: true }]).map((step) => step.range), [[ 0, 10 ], [ 6, 10 ], [ 0, 6 ]]);
  const currency = render(api.WaterfallChart, { ariaLabel: 'Revenue', data: [{ label: 'Start', value: 1200 }, { label: 'End', total: true }], formatValue: { currency: 'EUR', style: 'currency' }, locale: 'en-GB' });
  assert.match(currency, /€1,200\.00/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/charts/HeatmapChart/index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
/** A chart that rendered its plot: ready, one named tab stop, the keyboard hint and the table mirror. */
const assertFramed = (html, name) => {
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${name} renders ready`);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${name} plot is one tab stop`);
  assert.match(html, new RegExp(`aria-label="${name}"`), `${name} plot is named`);
  assert.match(html, /aria-roledescription="chart"/);
  assert.match(html, /data-slot="chart-data-table"/, `${name} mirrors its data in a table`);
};

test('HeatmapChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.HeatmapChart, { ariaLabel: 'HeatmapChart', ...{ data: [{ x: '09:00', y: 'Mon', value: 3 }, { x: '10:00', y: 'Mon', value: 5 }] } }), 'HeatmapChart');
  assert.equal(api.default, api.HeatmapChart, 'the owner default is the chart');
});

test('heatmaps step values onto the ramp and centre diverging scales', () => {
  assert.equal(api.heatmapStep(null, { domain: [ 0, 10 ] }).fill, 'var(--ds-color-chart-heat-0)');
  assert.equal(api.heatmapStep(10, { domain: [ 0, 10 ] }).fill, 'var(--ds-color-chart-heat-5)');
  assert.equal(api.heatmapStep(0, { domain: [ -5, 5 ], scale: 'diverging' }).fill, 'var(--ds-color-chart-div-mid)');
  assert.equal(api.heatmapStep(-5, { domain: [ -5, 5 ], scale: 'diverging' }).ink, 'var(--ds-color-chart-div-ink)');
  const html = render(api.HeatmapChart, { ariaLabel: 'Grid', data: [{ x: 'a', y: 'r1', value: 1 }, { x: 'b', y: 'r1', value: 2 }, { x: 'a', y: 'r2', value: 3 }] });
  assert.match(html, /r2 · b/, 'missing cells still appear in the table');
});

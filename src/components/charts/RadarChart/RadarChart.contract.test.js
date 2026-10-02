import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
/** A chart that rendered its plot: ready, one named tab stop, the keyboard hint and the table mirror. */
const assertFramed = (html, name) => {
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${name} renders ready`);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${name} plot is one tab stop`);
  assert.match(html, new RegExp(`aria-label="${name}"`), `${name} plot is named`);
  assert.match(html, /aria-roledescription="chart"/);
  assert.match(html, /data-slot="chart-data-table"/, `${name} mirrors its data in a table`);
};

test('RadarChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.RadarChart, { ariaLabel: 'RadarChart', ...{ data: [{ label: 'Clarity', draft: 7, target: 9 }, { label: 'Voice', draft: 8, target: 8 }], series: [{ key: 'draft', label: 'Draft' }, { key: 'target', label: 'Target', dashed: true }], domain: [ 0, 10 ] } }), 'RadarChart');
  assert.equal(api.default, api.RadarChart, 'the owner default is the chart');
});

test('every axis is a row with a value per series', () => {
  const html = render(api.RadarChart, { ariaLabel: 'Review', data: [{ label: 'Clarity', draft: 7, target: 9 }], series: [{ key: 'draft', label: 'Draft' }, { key: 'target', label: 'Target' }] });
  assert.match(html, /scope="row"[^>]*>Clarity</);
  assert.match(html, />Target</);
});

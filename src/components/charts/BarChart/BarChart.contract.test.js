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

test('BarChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.BarChart, { ariaLabel: 'BarChart', ...{ data: [{ label: 'Jan', search: 1840, social: 610 }, { label: 'Feb', search: 2110, social: 480 }], series: [{ key: 'search', label: 'Search' }, { key: 'social', label: 'Social' }] } }), 'BarChart');
  assert.equal(api.default, api.BarChart, 'the owner default is the chart');
});

test('horizontal bars put the categories on the side and keep the table', () => {
  const html = render(api.BarChart, { ariaLabel: 'Reads per post', data: [{ label: 'A long essay title', reads: 10 }], yKey: 'reads', layout: 'horizontal' });
  assertFramed(html, 'Reads per post');
  assert.match(html, />A long essay title</);
});

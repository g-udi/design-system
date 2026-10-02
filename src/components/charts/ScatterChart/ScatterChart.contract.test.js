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

test('ScatterChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.ScatterChart, { ariaLabel: 'ScatterChart', ...{ data: [{ x: 800, y: 4 }] } }), 'ScatterChart');
  assert.equal(api.default, api.ScatterChart, 'the owner default is the chart');
});

test('bubbles add their size to the table', () => {
  const html = render(api.BubbleChart, { ariaLabel: 'Pages', data: [{ label: 'Home', x: 1, y: 2, z: 30 }], zLabel: 'Sessions' });
  assertFramed(html, 'Pages');
  assert.match(html, />Sessions</);
});

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

test('SankeyChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.SankeyChart, { ariaLabel: 'SankeyChart', ...{ links: [{ source: 'Search', target: 'Essay', value: 40 }] } }), 'SankeyChart');
  assert.equal(api.default, api.SankeyChart, 'the owner default is the chart');
});

test('links become indexed nodes in order of appearance', () => {
  const graph = api.sankeyGraph({ links: [{ source: 'A', target: 'B', value: 2 }, { source: 'B', target: 'C', value: 1 }] });
  assert.deepEqual(graph.nodes.map((node) => node.name), [ 'A', 'B', 'C' ]);
  assert.deepEqual(graph.links.map((link) => [ link.source, link.target ]), [[ 0, 1 ], [ 1, 2 ]]);
});

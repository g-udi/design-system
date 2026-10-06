import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/charts/FunnelChart/index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
/** A chart that rendered its plot: ready, one named tab stop, the keyboard hint and the table mirror. */
const assertFramed = (html, name) => {
  assert.match(html, /data-slot="chart"[^>]*data-state="ready"/, `${name} renders ready`);
  assert.match(html, /role="group"[^>]*tabindex="0"|tabindex="0"[^>]*role="group"/, `${name} plot is one tab stop`);
  assert.match(html, new RegExp(`aria-label="${name}"`), `${name} plot is named`);
  assert.match(html, /aria-roledescription="chart"/);
  assert.match(html, /data-slot="chart-data-table"/, `${name} mirrors its data in a table`);
};

test('FunnelChart renders a labelled plot, a keyboard hint and a data table mirror', () => {
  assertFramed(render(api.FunnelChart, { ariaLabel: 'FunnelChart', ...{ data: [{ label: 'Visited', value: 1000 }, { label: 'Subscribed', value: 120 }] } }), 'FunnelChart');
  assert.equal(api.default, api.FunnelChart, 'the owner default is the chart');
});

test('an empty funnel shows the host copy and is not a tab stop', () => {
  const html = render(api.FunnelChart, { data: [], labels: { empty: 'Nobody has signed up yet.' } });
  assert.match(html, /Nobody has signed up yet\./);
  assert.doesNotMatch(html, /tabindex="0"/);
});

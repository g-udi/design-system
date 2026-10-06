import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { routeCollection } from '../../../../src/components/core/Map/mapModel.js';

test('Map renders a deterministic named loading state without WebGL or browser globals', async () => {
  const { Map } = await loadComponent(new URL('../../../../src/components/core/Map/index.js', import.meta.url));
  const render = () => renderToStaticMarkup(createElement(Map, { label: 'Delivery map', mapStyle: { version: 8, sources: {}, layers: [] }, labels: { loading: 'Preparing geography' } }));
  assert.equal(render(), render());
  assert.match(render(), /aria-label="Delivery map"/);
  assert.match(render(), /Preparing geography/);
  assert.doesNotMatch(render(), /<canvas|maplibregl/);
});

test('route data preserves host IDs, coordinates, zero widths and explicit presentation', () => {
  const coordinates = [[-73.9, 40.7], [-73.8, 40.8]];
  const result = routeCollection([{ id: 0, coordinates, color: '#123456', width: 0, dashed: true }]);
  assert.deepEqual(result.features[0], { type: 'Feature', id: 0, properties: { color: '#123456', width: 0, dashed: true }, geometry: { type: 'LineString', coordinates } });
  assert.deepEqual(routeCollection([]), { type: 'FeatureCollection', features: [] });
});

export function routeCollection(routes) {
  return {
    type: 'FeatureCollection',
    features: routes.map(({ id, coordinates, color = '#2563eb', width = 3, dashed = false }) => ({
      type: 'Feature', id,
      properties: { color, width, dashed },
      geometry: { type: 'LineString', coordinates }
    }))
  };
}

export function readView(map) {
  const { lng, lat } = map.getCenter();
  return { center: [lng, lat], zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() };
}

export function syncRoutes(map, routes) {
  const data = routeCollection(routes);
  const source = map.getSource('gaudi-routes');
  if (source) { source.setData(data); return; }
  map.addSource('gaudi-routes', { type: 'geojson', data });
  for (const dashed of [false, true]) {
    map.addLayer({
      id: `gaudi-routes-${dashed ? 'dashed' : 'solid'}`, type: 'line', source: 'gaudi-routes',
      filter: ['==', ['get', 'dashed'], dashed],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'], ...(dashed ? { 'line-dasharray': [2, 2] } : {}) }
    });
  }
}

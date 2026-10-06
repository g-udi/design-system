import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/Map': {
    ...definition('An interactive geographic map with selectable markers, route lines, and camera controls. Powered by MapLibre; applications supply their own style, geography, and prepared data.', [
      p('mapStyle', 'MapLibre StyleSpecification | string', 'required', 'A stable style object or an application-configured style URL. Gaudi has no built-in map service, access token, geocoding, or routing endpoint. Memoize object styles. Changing the style preserves the camera.'),
      p('initialViewState', '{ center: [longitude, latitude], zoom?, bearing?, pitch? }', '{ center: [0, 0], zoom: 2 }', 'Initial camera. Later changes use ref.flyTo, ref.fitBounds, or ref.reset. Coordinates always use longitude before latitude.'),
      p('markers', 'Array<{ id, coordinates, label, tone?, icon?, badge? }>', '[]', 'Stable unique IDs, [longitude, latitude] coordinates, and an accessible label. tone uses Button tones, icon is a React slot, and badge is optional visible metadata; include its meaning in label.'),
      p('selectedMarkerId / onMarkerClick', 'string | number / (id) => void', '— / —', 'Controlled selection. Pointer and keyboard activation request a selection; the host chooses whether to accept it. Selection does not move the camera.'),
      p('routes', 'Array<{ id, coordinates, color?, width?, dashed? }>', '[]', 'Prepared line strings (at least two coordinates each). The app supplies color and status meaning. Defaults: blue, 3px, solid. Preserve attribution in your map style.'),
      p('label', 'string', 'Map', 'Accessible name for the map region and keyboard canvas.'),
      p('controls', 'boolean', 'true', 'Shows reset, zoom in, and zoom out controls when interactive.'),
      p('interactive', 'boolean', 'true', 'Enables camera gestures and keyboard navigation. False disables those and hides camera controls; marker buttons remain selectable.'),
      p('scrollZoom', 'boolean', 'false', 'Enables wheel zoom. Off by default so a map embedded in a page does not trap page scrolling.'),
      p('minZoom / maxZoom', 'number / number', '0 / 20', 'Camera zoom bounds. Changes clamp the current view without replacing the map.'),
      p('onViewStateChange / onLoad / onError', '(view) => void / (view) => void / (error) => void', '— / — / —', 'Camera movement completion, map readiness, and renderer/style/source errors. view includes center, zoom, bearing, and pitch. onViewStateChange reports state; it is not a controlled camera prop.'),
      p('ref', '{ flyTo(view), fitBounds(bounds, options?), reset(), getViewState() }', '—', 'Imperative camera access after readiness. fitBounds accepts southwest/northeast coordinate pairs and optional MapLibre fit options. Camera motion honors reduced motion. getViewState returns null before mount.'),
      p('labels', '{ loading?, unavailable?, retry?, zoomIn?, zoomOut?, reset? }', 'English labels', 'Localized state and control text.'),
      p('children / fallback', 'ReactNode / ReactNode', '— / location buttons', 'Bottom-left overlay content and custom unavailable-state content. Retry remains available. Keep overlay content concise and provide a textual alternative for important geographic information.'),
      p('style', 'CSSProperties', '—', 'Container styling, including height (default 32rem). The map follows its container size.'),
      className
    ], 'The named region contains a focusable map canvas: arrows pan, plus/minus zoom. Marker buttons and controls work with Enter/Space and show focus. Selected markers expose aria-pressed. Browser touch gestures and reduced motion are supported. Geographic canvas content itself is not a screen-reader equivalent: provide a linked list or textual route summary, as the tracking example does.', [
      'Use an app-owned basemap and preserve the provider’s attribution. Style URLs, tiles, sprites, and glyphs are only requested when configured by the host. For local demos, the bundled NYC geometry and system fonts need no external services.',
      'The tracking story is a composition of Map, Button, Input, Select, Icon, and Pill. Vehicles and journeys are fictional, stored locally, and do not imply live tracking, traffic, or route calculation.',
      'Keep markers and route IDs stable. Updating coordinates moves the existing marker and preserves its button identity. Resource failures show a recoverable state with a list fallback; WebGL support is required to draw the map.'
    ]),
    usage: `'use client';

import { useState } from 'react';
import { Map } from '@gaudi/design-system/core/Map';

const meeting = {
  id: 'meeting',
  coordinates: [-73.983, 40.7535],
  label: 'Bryant Park meeting point'
};

// Pass the host application's MapLibre style object or URL as mapStyle.
// Load @gaudi/design-system/styles.css once in the application's stylesheet entry.
export function MeetingMap({ mapStyle }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div>
      <Map
        label='Meeting location'
        mapStyle={mapStyle}
        initialViewState={{ center: meeting.coordinates, zoom: 15 }}
        markers={[meeting]}
        selectedMarkerId={selectedId}
        onMarkerClick={setSelectedId}
        style={{ height: '24rem' }}
      />
      <p>Bryant Park, 42nd Street and Sixth Avenue, New York.</p>
      {selectedId === meeting.id && (
        <p role='status'>Meet at the Sixth Avenue entrance.</p>
      )}
    </div>
  );
}`
  }
};

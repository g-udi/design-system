# Map

`Map` renders a host-supplied MapLibre style with selectable markers, route lines,
camera controls, and a recoverable unavailable state. Import it from the public
owner entry:

```jsx
'use client';

import { useState } from 'react';
import { Map } from '@gaudi/design-system/core/Map';

const meeting = {
  id: 'meeting',
  coordinates: [-73.983, 40.7535],
  label: 'Bryant Park meeting point'
};

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
}
```

Pass your application's MapLibre style object or style URL as `mapStyle`. Keep
object styles stable, for example with a module constant or `useMemo`. Load
`@gaudi/design-system/styles.css` once in your application's stylesheet entry;
it already includes MapLibre's CSS.

## Data and application ownership

Coordinates always use `[longitude, latitude]`. Supply valid coordinates and
stable, unique string or number IDs. Keep each ID's type consistent across data,
selection, and callbacks. Updating a marker's coordinates moves its existing
button, preserving focus.

| Prop | Contract |
| --- | --- |
| `mapStyle` | Required MapLibre style object or URL. Changing it preserves the current camera and reloads the style and overlays. |
| `markers` | Array of `{ id, coordinates, label, tone?, icon?, badge? }`; defaults to `[]`. `label` is the button's accessible name. `tone` uses Button tones and defaults to `accent`; `icon` accepts a React node and defaults to a map pin. |
| `selectedMarkerId` | Controlled selection. Match a marker ID exactly, or use `null` for no selection. |
| `onMarkerClick` | Receives the activated marker's ID, including activation from the fallback list. Update `selectedMarkerId` to accept the selection. |
| `routes` | Array of `{ id, coordinates, color?, width?, dashed? }`; defaults to `[]`. Each route needs at least two coordinate pairs. Defaults are `#2563eb`, `3` pixels, and a solid line. |

Selecting a marker does not change the camera. Focusing an offscreen marker brings
it into view. Routes are prepared line strings, without route calculation or
route selection. The host determines status labels, colors, filtering, selected
route emphasis, and any location details shown beside the map.

Gaudi supplies no basemap, provider endpoint, access token, geocoding, routing,
traffic, or tracking service. The application owns those integrations, data
updates, tiles, sprites, glyphs, and required attribution. Include attribution in
the supplied style's sources; the map shows MapLibre's compact attribution
control. Avoid the reserved source ID `gaudi-routes` and layer IDs
`gaudi-routes-solid` and `gaudi-routes-dashed` in your style.

Storybook's tracking, single-location, and recovery examples use local NYC
geography in `.storybook/public/static/maps` and fictional journey data. Those
assets are documentation fixtures and are not shipped in the npm package.

## Camera and events

| Prop | Default and behavior |
| --- | --- |
| `initialViewState` | `{ center: [0, 0], zoom: 2 }`. Accepts `center`, `zoom`, `bearing`, and `pitch`. Applied on mount and retry; later prop changes do not move the camera. Reset uses the latest value. |
| `interactive` | `true`. Enables pan, zoom, and keyboard navigation. When false, camera gestures and controls are disabled; marker buttons remain selectable. |
| `controls` | `true`. Shows reset, zoom in, and zoom out while interactive. |
| `scrollZoom` | `false`. Opt in to wheel zoom when appropriate for the surrounding page. |
| `minZoom` / `maxZoom` | `0` / `20`. Updates clamp the current camera without replacing the map. |
| `onLoad` | Receives the view when the map is ready, and again after a replacement style becomes ready. |
| `onViewStateChange` | Receives the view after camera movement ends. This is a notification, not a controlled camera prop. |
| `onError` | Receives renderer, style, or source errors. The unavailable state handles recovery locally. |

Views have `{ center: [longitude, latitude], zoom, bearing, pitch }`. Attach a
React ref for explicit camera actions after `onLoad`:

| Ref method | Behavior |
| --- | --- |
| `flyTo(view)` | Moves to the supplied camera values. |
| `fitBounds(bounds, options?)` | Fits `[[west, south], [east, north]]`; accepts MapLibre fit options and defaults to `48` pixels of padding. |
| `reset()` | Returns to the latest `initialViewState`. |
| `getViewState()` | Returns the current view, or `null` before renderer initialization. |

Camera methods use a 600 ms transition, or no transition when reduced motion is
requested. Built-in zoom controls use 200 ms. Passing a duration does not override
these timings.

## Layout, accessibility, and recovery

The map fills its container width, defaults to `32rem` tall, and resizes with its
container. Use `style` or `className` to set the required height. `children` appear
in a bottom-left overlay while ready; keep legends and location cards concise so
they fit narrow containers and leave the attribution accessible.

Set `label` for the named map region and keyboard canvas; its default is `Map`.
Arrow keys pan, plus/minus zoom, and marker and control buttons support
Enter/Space. Selected markers expose `aria-pressed`. A marker's `badge` is visual
metadata hidden from assistive technology, so include its meaning in `label`
(for example, “TRK-208, 25 minutes delayed”).

Provide a visible list or textual summary for important locations and routes;
the geographic canvas is not a screen-reader equivalent. Use labels, icons, or
line patterns alongside status colors. Keep essential information outside
`children`, which is hidden during loading and failure.

While loading, the map announces its loading status. On error, it presents an
unavailable message, a selectable marker list, and a retry button. Supply
`fallback` to replace the list with application-specific content; retry remains
available. Retry rebuilds the renderer with the current style and initial view.
Replacing a failed style with a valid one also supports recovery. After recovery
from a focused fallback or retry button, focus moves to the map canvas.

Override state and control text with
`labels={{ loading, unavailable, retry, zoomIn, zoomOut, reset }}`. These keys
localize those messages and buttons; they do not replace the canvas keyboard
instructions or the controls group's accessible name.

The component imports MapLibre in a client effect, so server rendering does not
initialize WebGL. Drawing the map requires browser WebGL support. MapLibre is a
package dependency and uses its bundled worker; no custom worker setup or Vite
dependency exclusion is required. If the host enforces a Content Security Policy,
its worker policy must allow `blob:` workers and its resource policy must allow
the host's configured map resources.

# SignaturePad

> Core/SignaturePad · core · `@gaudi/design-system/core/SignaturePad`

A composable signature input with pressure-aware SVG ink, undo and redo, native forms, saved previews, and image or JSON export.

## Import

```js
import SignaturePad from '@gaudi/design-system/core/SignaturePad';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `SignaturePad`, `SignaturePadArea`, `SignaturePadClear`, `SignaturePadControls`, `SignaturePadGuide`, `SignaturePadPlaceholder`, `SignaturePadPreview`, `SignaturePadRedo`, `SignaturePadSave`, `SignaturePadUndo`, `default`, `getSignaturePadBounds`, `getSignaturePadStrokePath`, `serializeSignaturePad`, `signaturePadLabels`, `signaturePadToBlob`, `signaturePadToDataURL`, `signaturePadToSVG`, `useSignaturePad`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value / defaultValue / onValueChange` | `SignaturePadStroke[] / function` | `[]` | no | Controlled or initial strokes. A stroke is { points: [x, y, diameter][], color? }. Changes fire once per completed stroke or history action. |
| `disabled / readOnly / invalid` | `boolean` | `false` | no | Disabled prevents interaction and form submission; readOnly allows saving existing ink. Invalid marks the drawing area. |
| `name` | `string` | — | no | Native form field name, external form association, validation, and submission format. Reset restores defaultValue and clears history. |
| `form` | `string` | — | no | Native form field name, external form association, validation, and submission format. Reset restores defaultValue and clears history. |
| `required` | `boolean` | `false` | no | Native form field name, external form association, validation, and submission format. Reset restores defaultValue and clears history. |
| `format` | `svg \| png \| jpeg \| json` | `svg` | no | Native form field name, external form association, validation, and submission format. Reset restores defaultValue and clears history. |
| `color` | `CSS color` | `currentColor` | no | Optional ink color recorded per stroke; unset ink follows the theme. Export defaults to black. |
| `minWidth / maxWidth` | `number` | `0.8 / 3.2` | no | Minimum and maximum ink diameter in CSS pixels. Equal values produce a constant line. |
| `smoothing` | `number` | `0.5` | no | 0–1 smoothing; higher values soften the curve. |
| `sizing` | `auto \| pressure \| velocity` | `auto` | no | Auto reads pen pressure and uses speed for mouse or touch. |
| `pointerTypes` | `(mouse \| touch \| pen)[]` | `all` | no | Filter input devices, such as ["pen"] to ignore touch. |
| `onStrokeStart / onStrokeEnd` | `function` | — | no | Receive { pointerType } when drawing starts and the completed stroke when it ends. Cancelled strokes are discarded. |
| `apiRef` | `ref` | — | no | Access strokes, isEmpty, isDrawing, canUndo, canRedo, clear, undo, redo, focus, toSVG, toDataURL, toBlob, and serialize. |
| `useSignaturePad()` | `hook` | — | no | Access strokes, isEmpty, isDrawing, canUndo, canRedo, clear, undo, redo, focus, toSVG, toDataURL, toBlob, and serialize. |
| `labels` | `object` | `English labels` | no | Override drawing instructions, placeholder, state announcements, and default button labels. Area and Preview accept their own ARIA names. |
| `SignaturePadArea.variant` | `default \| muted \| ghost` | `default` | no | Drawing surface appearance. Root sizing and state props are shared with every part. |
| `SignaturePadControls.position` | `top-start \| top-end \| bottom-start \| bottom-end` | `top-end` | no | Pins controls inside the drawing surface; a regular flex row can place them outside. |
| `SignaturePadSave.format` | `format` | `png` | no | Serialize to a data URL or JSON and pass it to the host. Saving performs no download or upload itself. |
| `options` | `export options` | — | no | Serialize to a data URL or JSON and pass it to the host. Saving performs no download or upload itself. |
| `onSave` | `(value, strokes) => void` | — | no | Serialize to a data URL or JSON and pass it to the host. Saving performs no download or upload itself. |
| `SignaturePadPreview.strokes` | `strokes` | — | no | A standalone SVG preview cropped to its ink; aria-label names its purpose. |
| `padding` | `number` | `4` | no | A standalone SVG preview cropped to its ink; aria-label names its purpose. |
| `color` | `CSS color` | `currentColor` | no | A standalone SVG preview cropped to its ink; aria-label names its purpose. |
| `export options` | `object` | `padding 8; raster scale 2` | no | width and height set a fixed frame. Otherwise crop includes ink thickness and padding. background, color, scale, type, and quality configure output. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `format`: `svg`, `png`, `jpeg`, `json`
- `sizing`: `auto`, `pressure`, `velocity`

## Usage

```jsx
import { SignaturePad, SignaturePadArea, SignaturePadGuide, SignaturePadPlaceholder, SignaturePadUndo, SignaturePadRedo, SignaturePadClear, SignaturePadSave } from '@gaudi/design-system/core/SignaturePad';

<SignaturePad name='signature' required onValueChange={setStrokes}>
  <SignaturePadArea aria-label='Recipient signature'>
    <SignaturePadGuide />
    <SignaturePadPlaceholder />
  </SignaturePadArea>
  <div className='flex flex-wrap gap-2'>
    <SignaturePadUndo />
    <SignaturePadRedo />
    <SignaturePadClear />
    <SignaturePadSave format='svg' onSave={handleSave} />
  </div>
</SignaturePad>
```

## Accessibility

Give the area a visible label and useful instructions. Drawing requires a pointer, so compose a typed-name alternative with Core Tabs and Input when the workflow needs keyboard-only entry. Undo/redo shortcuts apply only within the area, respect editable overlays and IME, and do not capture page shortcuts. Cancel a live stroke with Escape. Clear and exhausted history controls return focus to the area.

## Notes

- Compose SignaturePadArea inside SignaturePad; guide, placeholder, controls, and save actions are optional.
- Store the stroke array to reopen and edit a signature. A changed controlled value clears history; an equivalent deep copy preserves it.
- Applications own consent, document identity, validation policy, upload, persistence, and any signing audit trail.

## Examples

- Playground (Storybook `core-signaturepad--playground`)
- Native Form (Storybook `core-signaturepad--native-form`)
- Draw Or Type (Storybook `core-signaturepad--draw-or-type`)
- Export Formats (Storybook `core-signaturepad--export-formats`)
- Controlled And Stylus (Storybook `core-signaturepad--controlled-and-stylus`)

## Related

`core-tabs`, `core-input`, `mdx-preview`

## README

Composable signature entry with SVG ink, mouse/touch/pen input, undo/redo, a native form value, saved previews, and PNG, JPEG, SVG, or JSON export. Adapted from [ReUI Signature Pad](https://reui.io/docs/components/base/signature-pad), under the MIT notice in the [root README](../../../../README.md#third-party-notices).

```jsx
import {
  SignaturePad, SignaturePadArea, SignaturePadGuide,
  SignaturePadPlaceholder, SignaturePadClear, SignaturePadSave
} from '@gaudi/design-system/core/SignaturePad';

<SignaturePad value={strokes} onValueChange={setStrokes} name='signature' required>
  <SignaturePadArea aria-label='Recipient signature'>
    <SignaturePadGuide />
    <SignaturePadPlaceholder />
  </SignaturePadArea>
  <div className='flex flex-wrap gap-2'>
    <SignaturePadClear />
    <SignaturePadSave format='svg' onSave={(dataUrl, strokes) => save(dataUrl, strokes)} />
  </div>
</SignaturePad>
```

### Value and editing

Each stroke is `{ points: [[x, y, diameter], ...], color? }`. Coordinates use the drawing area's CSS pixel space; the display scales existing ink uniformly when a container becomes smaller without mutating the stored data. `onValueChange` fires once when a stroke completes or history changes, never for each pointer move. Treat values as immutable.

`value` is controlled; `defaultValue` initializes local state. Equal deep copies preserve history. A different external value starts a new history. Refused controlled changes leave the accepted strokes and history authoritative. History retains up to 100 changes.

`color` is optional: unset ink follows the theme. `minWidth` / `maxWidth` set the ink diameter (0.8 / 3.2 by default); `smoothing` is 0–1. `sizing='auto'` uses pen pressure and mouse/touch velocity. Use `pointerTypes={['pen']}` to reject touch. Pointer cancellation, lost capture, Escape, a resize during drawing, or disabling/locking the pad discard unfinished ink. Overlay controls do not draw beneath themselves.

### Parts and API

- `SignaturePadArea`: labelled drawing area; `variant='default' | 'muted' | 'ghost'`. Fills its container width with a default height of `12rem`; override its height with a class.
- `SignaturePadGuide`, `SignaturePadPlaceholder`: optional non-interactive overlays.
- `SignaturePadControls`: pinned controls; `position='top-start' | 'top-end' | 'bottom-start' | 'bottom-end'`.
- `SignaturePadUndo`, `SignaturePadRedo`, `SignaturePadClear`, `SignaturePadSave`: Gaudi buttons, supporting button props and text children. Their click handlers compose with host handlers and honor `preventDefault()`.
- `SignaturePadPreview`: a server-renderable, standalone SVG from `strokes`, cropped with `padding` (default 4). Supply an `aria-label` for its purpose.
- `useSignaturePad()` or `apiRef`: `strokes`, `isEmpty`, `isDrawing`, `canUndo`, `canRedo`, `disabled`, `readOnly`, `clear()`, `undo()`, `redo()`, `focus()`, `toSVG(options)`, `toDataURL(options)`, `toBlob(options)`, `serialize(format, options)`. Editing operations also respect disabled/read-only state.

### Styling

The pad follows Gaudi's compact neutral styling: shared rounded corners, input border, semantic background/foreground colors, and the accent token for visible focus. These tokens support light and dark themes. Component gaps and internal padding follow the `--ds-space-scale` multiplier. Pinned controls wrap within the drawing area; completed ink preserves its proportions as the container shrinks, as described above.

### Forms and exports

`name` creates a native field; `form` associates it with an external form. `required` rejects an empty value and focuses the drawing area. `format` defaults to SVG. PNG/JPEG form formats rasterize after each completed change; SVG/JSON avoid that work. A disabled pad is omitted from `FormData`. Native reset restores `defaultValue` and clears history; cancelling reset preserves the value. `invalid` and `aria-describedby` connect application validation feedback.

Save returns a data URL for PNG, JPEG, or SVG; JSON returns the stroke array as a string. It does not upload or download. Export helpers are `getSignaturePadBounds`, `getSignaturePadStrokePath`, `signaturePadToSVG`, `signaturePadToDataURL`, `signaturePadToBlob`, and `serializeSignaturePad`. Raster helpers require a browser and belong in handlers/effects; SVG/JSON helpers and previews work on the server. Empty serialization is an empty string.

Exports crop to the ink including stroke thickness and 8px padding. Both `width` and `height` fix a frame; `crop: false` keeps the origin. With the pad API, `crop: false` uses its displayed coordinate frame. `color` defaults to black; `background` is transparent except JPEG, which defaults to white. Raster `scale` defaults to 2; `type` and `quality` configure the image. Use `toBlob()` for uploads without base64 expansion.

### Accessibility and application boundaries

Give the area a visible label with `aria-labelledby` and instructions through `aria-describedby`. `labels` overrides default labels and instructions. Undo/redo supports Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, and Ctrl/Cmd+Y; editable overlays and IME keep their own keyboard handling. The surface shows focus, preserves ink across themes, and returns focus from actions that disable themselves.

Drawing has no keyboard equivalent. The Draw or Type example composes existing Tabs, Input, and Button and stores the typed name as a separate application value. Applications own consent, document identity, persistence, upload, and signing policy; this component collects input.

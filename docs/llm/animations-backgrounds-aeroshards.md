# AeroShards

> Animations/Backgrounds/AeroShards · animations · `@gaudi/design-system/animations/AeroShards`

Faceted shards flow through a curved stream in layers of depth. Hold the pointer to gather the stream, then release to unfurl it.

## Import

```js
import AeroShards from '@gaudi/design-system/animations/AeroShards';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `AeroShards`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation. |
| `speed` | `number` | `1` | no | Playback multiplier from 0 to 5. Zero freezes time. |
| `intensity` | `number` | `1` | no | Visibility of the shards, clamped to 0–2. Zero shows only the background color. |
| `scale` | `number` | `1` | no | Spatial scale from 0.25 to 4. Larger values produce larger details. |
| `colors` | `string[]` | `Gaudi theme colors` | no | Up to three CSS colors. Omit to follow the current Gaudi theme. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect, also used by the static fallback. |
| `interactive` | `boolean` | `true` | no | The pointer repels nearby shards. Press and hold to gather a rotating cloud; release to unfurl. Input stops while paused. |
| `height` | `number \| string` | `360` | no | Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container. |
| `children` | `ReactNode` | — | no | Accessible foreground content layered above the decorative canvas. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer div. Standard DOM attributes and handlers are forwarded. |

## Usage

```jsx
import { AeroShards } from '@gaudi/design-system/animations/AeroShards';

<AeroShards height={500} paused={paused} />
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- Shard size varies with depth. Hold/release changes the stream envelope without resetting its retained phase.
- Visual idea inspired by AeroShards from React Bits. Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-aero-shards--playground`)

## Related

`core-input`

## README

Asymmetric, folded shards tumble through a broad stream with perspective depth and pearl reflections. RGB edge separation follows the camera position. Hold the pointer to gather the stream, then release to unfurl it.

```jsx
import { AeroShards } from '@gaudi/design-system/animations/AeroShards';

<AeroShards height={500} paused={paused} />
```

- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation.
- `speed` (number, default 1): Playback multiplier from 0 to 5. Zero freezes time.
- `intensity` (number, default 1): Visibility of the shards, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Spatial scale from 0.25 to 4. Larger values produce larger details.
- `colors` (string[], default Gaudi theme colors): Up to three CSS colors. Omit to follow the current Gaudi theme.
- `background` (string, default var(--ds-color-surface)): CSS color behind the effect, also used by the static fallback.
- `interactive` (boolean, default true): The pointer repels nearby shards. Press and hold to gather a rotating cloud; release to unfurl. Input stops while paused.
- `height` (number | string, default 360): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default —): Accessible foreground content layered above the decorative canvas.
- `className / style / ref` (DOM props, default —): Applied to the outer div. Standard DOM attributes and handlers are forwarded.

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

A bounded mesh of 1,280 independently positioned shards uses four non-coplanar triangular faces per shard. Size, depth, shape and roll vary independently. Holding gathers the same particles into individual circulating orbits; release restores their stream trajectories without resetting time. Narrow containers crop the same world span instead of concentrating the entire particle count into a phone-sized field.

The private renderer shares Gaudi’s canvas lifecycle, uses depth testing for overlapping facets, and releases its mesh, shaders, texture and depth framebuffer on unmount or context replacement. This is an original approximation of the rendered reference; alternate upstream materials, formations and presets are not included.

Visual idea inspired by [AeroShards](https://reactbits.dev/backgrounds/aero-shards) from [React Bits](https://reactbits.dev). Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

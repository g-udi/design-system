# WarpText

> Animations/Text/WarpText · animations · `@gaudi/design-system/animations/WarpText`

Text gently undulates at rest and bends beneath a moving pointer lens. Hover magnifies a local area, adds a soft ripple and optional RGB refraction, then eases back on exit.

## Import

```js
import WarpText from '@gaudi/design-system/animations/WarpText';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `WarpText`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | `"Bend the moment"` | no | Text to render; newline characters create multiple centered lines. |
| `warpStrength` | `number` | `0.08` | no | Ambient distortion, clamped to 0–0.25. Set 0 for hover-only warping. |
| `warpScale` | `number` | `1.7` | no | Size of the ambient distortion field, clamped to 0.5–5. |
| `speed` | `number` | `0.55` | no | Ambient and ripple speed, clamped to 0–3. Zero holds the field still; pointer interaction remains available. |
| `pointerRadius` | `number` | `0.42` | no | Lens radius as a fraction of the container height, clamped to 0.1–1. |
| `pointerStrength` | `number` | `0.38` | no | Pointer-driven bending and magnification, clamped to 0–1. Zero disables the lens. |
| `refraction` | `number` | `0.018` | no | RGB edge separation, clamped to 0–0.06. Set 0 for a clean lens. Most visible on light text against a dark surface. |
| `ripple` | `boolean` | `true` | no | Add a soft radial ripple inside the pointer lens. |
| `paused` | `boolean` | `false` | no | Render undistorted text and stop pointer effects and frame updates. Also respects reduced motion, hidden tabs and offscreen containers. |
| `className / style / ref` | `DOM props` | — | no | Applied to the root. Typography and color are inherited; text shrinks to fit. Set height through style or className. |

## Usage

```jsx
import { WarpText } from '@gaudi/design-system/animations/WarpText';

<div style={{ fontSize: 96, fontWeight: 700 }}>
  <WarpText text="Bend the moment" />
</div>
```

## Accessibility

The full text is exposed once. The canvas is decorative and does not change the accessible text. Paused and reduced-motion states are undistorted. Touch does not latch hover, and no extra keyboard stop is added for a decorative effect. Provide a pause control for continuous motion.

## Notes

- Typography and color come from the host. The text texture fits its container and refreshes when fonts or themes change.
- WebGL unavailable or lost: the readable HTML text remains visible. Forced colors uses the HTML fallback.
- Visual behavior inspired by Warp Text from React Bits. Independently implemented for Gaudi; no upstream source or assets are included.

## Examples

- Playground (Storybook `animations-text-warptext--playground`)
- Hover lens (Storybook `animations-text-warptext--hover-only`)
- Multiline refraction (Storybook `animations-text-warptext--multiline`)

## Related

`core-pointer`

## README

Text gently undulates at rest and bends beneath a moving pointer lens. Hover magnifies a local area, adds a soft ripple and optional RGB refraction, then eases back on exit.

```jsx
import { WarpText } from '@gaudi/design-system/animations/WarpText';

<div style={{ fontSize: 96, fontWeight: 700 }}>
  <WarpText text="Bend the moment" />
</div>
```

- `text` (string, default "Bend the moment"): Text to render; newline characters create multiple centered lines.
- `warpStrength` (number, default 0.08): Ambient distortion, clamped to 0–0.25. Set 0 for hover-only warping.
- `warpScale` (number, default 1.7): Size of the ambient distortion field, clamped to 0.5–5.
- `speed` (number, default 0.55): Ambient and ripple speed, clamped to 0–3. Zero holds the field still; pointer interaction remains available.
- `pointerRadius` (number, default 0.42): Lens radius as a fraction of the container height, clamped to 0.1–1.
- `pointerStrength` (number, default 0.38): Pointer-driven bending and magnification, clamped to 0–1. Zero disables the lens.
- `refraction` (number, default 0.018): RGB edge separation, clamped to 0–0.06. Set 0 for a clean lens. Most visible on light text against a dark surface.
- `ripple` (boolean, default true): Add a soft radial ripple inside the pointer lens.
- `paused` (boolean, default false): Render undistorted text and stop pointer effects and frame updates. Also respects reduced motion, hidden tabs and offscreen containers.
- `className / style / ref` (DOM props, default —): Applied to the root. Typography and color are inherited; text shrinks to fit. Set height through style or className.

The full text is exposed once. The canvas is decorative and does not change the accessible text. Paused and reduced-motion states are undistorted. Touch does not latch hover, and no extra keyboard stop is added for a decorative effect. Provide a pause control for continuous motion.

Typography and color come from the host. The text texture fits its container and refreshes when fonts or themes change.

WebGL unavailable or lost: the readable HTML text remains visible. Forced colors uses the HTML fallback.

Visual behavior inspired by [Warp Text](https://reactbits.dev/text-animations/warp-text) from React Bits. Independently implemented; no upstream code or assets are included.

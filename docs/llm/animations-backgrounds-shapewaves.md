# ShapeWaves

> Animations/Backgrounds/ShapeWaves · animations · `@gaudi/design-system/animations/ShapeWaves`

Ten-pixel cells cycle through triangle, circle and square bands, with optional text carved out of the field.

## Import

```js
import ShapeWaves from '@gaudi/design-system/animations/ShapeWaves';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `ShapeWaves`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | `''` | no | Optional text cut out of the decorative canvas and exposed once to assistive technology. Foreground children remain unmasked. |
| `textSize` | `number` | `0.6` | no | Cutout height relative to the surface, clamped to 0.1–1. Long text shrinks to fit. |
| `cellSize` | `number` | `10` | no | Grid pitch in CSS pixels, clamped to 4–40. |
| `dotSize` | `number` | `0.75` | no | Glyph size as a fraction of a cell, clamped to 0.1–0.95. |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation. |
| `speed` | `number` | `1` | no | Playback multiplier from 0 to 5. Zero freezes time. |
| `intensity` | `number` | `1` | no | Visibility of the geometric marks, clamped to 0–2. Zero shows only the background color. |
| `scale` | `number` | `1` | no | Spatial scale from 0.25 to 4. Larger values produce larger details. |
| `colors` | `string[]` | `Gaudi theme colors` | no | Up to three CSS colors. Omit to follow the current Gaudi theme. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect, also used by the static fallback. |
| `interactive` | `boolean` | `true` | no | Moving the pointer leaves fading light; clicking sends a spreading ripple. Input stops while motion is paused. |
| `height` | `number \| string` | `360` | no | Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container. |
| `children` | `ReactNode` | — | no | Accessible foreground content layered above the decorative canvas. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer div. Standard DOM attributes and handlers are forwarded. |

## Usage

```jsx
import { ShapeWaves } from '@gaudi/design-system/animations/ShapeWaves';

<ShapeWaves height={500} paused={paused} />
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

## Notes

- The text cutout is empty by default. Set the text control to add your own cutout.
- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- Scale changes wave size while cellSize controls glyph density. Dark bands are triangles, middle bands circles and bright bands squares.
- Visual idea inspired by ShapeWaves from React Bits. Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-shape-waves--playground`)

## Related

`core-input`

## README

Ten-pixel cells cycle through triangle, circle and square bands, with optional text carved out of the field.

```jsx
import { ShapeWaves } from '@gaudi/design-system/animations/ShapeWaves';

<ShapeWaves height={500} paused={paused} />
```

- `text` (string, default ''): Optional text cut out of the decorative canvas and exposed once to assistive technology. Foreground children remain unmasked.
- `textSize` (number, default 0.6): Cutout height relative to the surface, clamped to 0.1–1. Long text shrinks to fit.
- `cellSize` (number, default 10): Grid pitch in CSS pixels, clamped to 4–40.
- `dotSize` (number, default 0.75): Glyph size as a fraction of a cell, clamped to 0.1–0.95.
- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation.
- `speed` (number, default 1): Playback multiplier from 0 to 5. Zero freezes time.
- `intensity` (number, default 1): Visibility of the geometric marks, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Spatial scale from 0.25 to 4. Larger values produce larger details.
- `colors` (string[], default Gaudi theme colors): Up to three CSS colors. Omit to follow the current Gaudi theme.
- `background` (string, default var(--ds-color-surface)): CSS color behind the effect, also used by the static fallback.
- `interactive` (boolean, default true): Moving the pointer leaves fading light; clicking sends a spreading ripple. Input stops while motion is paused.
- `height` (number | string, default 360): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default —): Accessible foreground content layered above the decorative canvas.
- `className / style / ref` (DOM props, default —): Applied to the outer div. Standard DOM attributes and handlers are forwarded.

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

Scale changes wave size while cellSize controls glyph density. Dark bands are triangles, middle bands circles and bright bands squares.

Visual idea inspired by [ShapeWaves](https://reactbits.dev/backgrounds/shape-waves) from [React Bits](https://reactbits.dev). Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

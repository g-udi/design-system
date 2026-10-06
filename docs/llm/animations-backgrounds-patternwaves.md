# PatternWaves

> Animations/Backgrounds/PatternWaves · animations · `@gaudi/design-system/animations/PatternWaves`

A nine-pixel dot lattice shades folded fabric with narrow illuminated creases and localized ripples.

## Import

```js
import PatternWaves from '@gaudi/design-system/animations/PatternWaves';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `PatternWaves`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation. |
| `speed` | `number` | `0.35` | no | Playback multiplier from 0 to 5. Zero freezes time. |
| `intensity` | `number` | `1` | no | Surface deformation and ink strength, clamped to 0–2. Zero shows only the background color. |
| `scale` | `number` | `1` | no | Spatial scale from 0.25 to 4. Larger values produce larger details. |
| `colors` | `string[]` | `Gaudi theme colors` | no | Up to three CSS colors. Omit to follow the current Gaudi theme. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect, also used by the static fallback. |
| `interactive` | `boolean` | `true` | no | Moving the pointer leaves fading light; clicking sends a spreading ripple. Input stops while motion is paused. |
| `height` | `number \| string` | `360` | no | Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container. |
| `children` | `ReactNode` | — | no | Accessible foreground content layered above the decorative canvas. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer div. Standard DOM attributes and handlers are forwarded. |

## Usage

```jsx
import { PatternWaves } from '@gaudi/design-system/animations/PatternWaves';

<PatternWaves height={500} paused={paused} />
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- Scale changes the CSS-pixel spacing of the dots; light and shadow describe the fabric folds.
- Visual idea inspired by PatternWaves from React Bits. Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-pattern-waves--playground`)

## Related

`core-input`

## README

A nine-pixel dot lattice shades folded fabric with narrow illuminated creases and localized ripples.

```jsx
import { PatternWaves } from '@gaudi/design-system/animations/PatternWaves';

<PatternWaves height={500} paused={paused} />
```

- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation.
- `speed` (number, default 0.35): Playback multiplier from 0 to 5. Zero freezes time.
- `intensity` (number, default 1): Surface deformation and ink strength, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Spatial scale from 0.25 to 4. Larger values produce larger details.
- `colors` (string[], default Gaudi theme colors): Up to three CSS colors. Omit to follow the current Gaudi theme.
- `background` (string, default var(--ds-color-surface)): CSS color behind the effect, also used by the static fallback.
- `interactive` (boolean, default true): Moving the pointer leaves fading light; clicking sends a spreading ripple. Input stops while motion is paused.
- `height` (number | string, default 360): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default —): Accessible foreground content layered above the decorative canvas.
- `className / style / ref` (DOM props, default —): Applied to the outer div. Standard DOM attributes and handlers are forwarded.

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

Scale changes the CSS-pixel spacing of the dots; light and shadow describe the fabric folds.

Visual idea inspired by [PatternWaves](https://reactbits.dev/backgrounds/pattern-waves) from [React Bits](https://reactbits.dev). Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

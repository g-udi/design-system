# Plasma

> Animations/Backgrounds/Plasma · animations · `@gaudi/design-system/animations/Plasma`

Translucent plasma folds flow across the surface, with soft illuminated edges.

## Import

```js
import Plasma from '@gaudi/design-system/animations/Plasma';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `Plasma`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `direction` | `"forward" \| "reverse"` | `forward` | no | Direction of the flowing folds. |
| `turbulence` | `number` | `1` | no | Fold distortion, clamped to 0–2. |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation. |
| `speed` | `number` | `1` | no | Animation speed multiplier, clamped to 0–5. Zero holds a static frame. |
| `intensity` | `number` | `1` | no | Effect strength, clamped to 0–2. Zero reveals the background color. |
| `scale` | `number` | `1` | no | Spatial scale of the effect, clamped to 0.25–4. |
| `colors` | `string[]` | `Gaudi theme tokens` | no | Up to three CSS colors. Omitted colors inherit the current Gaudi palette. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect and its static fallback. |
| `interactive` | `boolean` | `false` | no | Let pointer position influence the effect without capturing clicks or scrolling. |
| `height` | `number \| string` | `360` | no | Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container. |
| `children` | `ReactNode` | — | no | Optional semantic content layered above the decorative canvas. |
| `className / style / ref / DOM props` | `DOM props` | — | no | Forwarded to the outer container. |

## Variants

- `direction`: `forward`, `reverse`

## Usage

```jsx
import { Plasma } from '@gaudi/design-system/animations/Plasma';

<Plasma height={500} paused={false} />
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- The flowing field uses broad folds with narrow illuminated rims. Pointer interaction adds subtle parallax.
- Visual idea inspired by Plasma from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-plasma--playground`)

## Related

`core-pointer`, `core-direction`

## README

Translucent plasma folds flow across the surface, with soft illuminated edges.

```jsx
import { Plasma } from '@gaudi/design-system/animations/Plasma';

<Plasma height={500} paused={false} />
```

The flowing field uses broad folds with narrow illuminated rims. Pointer interaction adds subtle parallax.

### Contract

- `direction` ("forward" | "reverse", default `forward`): Direction of the flowing folds.
- `turbulence` (number, default `1`): Fold distortion, clamped to 0–2.
- `paused` (boolean, default `false`): Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation.
- `speed` (number, default `1`): Animation speed multiplier, clamped to 0–5. Zero holds a static frame.
- `intensity` (number, default `1`): Effect strength, clamped to 0–2. Zero reveals the background color.
- `scale` (number, default `1`): Spatial scale of the effect, clamped to 0.25–4.
- `colors` (string[], default `Gaudi theme tokens`): Up to three CSS colors. Omitted colors inherit the current Gaudi palette.
- `background` (string, default `var(--ds-color-surface)`): CSS color behind the effect and its static fallback.
- `interactive` (boolean, default `false`): Let pointer position influence the effect without capturing clicks or scrolling.
- `height` (number | string, default `360`): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default `—`): Optional semantic content layered above the decorative canvas.
- `className / style / ref / DOM props` (DOM props, default `—`): Forwarded to the outer container.

The shared renderer caps drawing at 30fps, device pixel ratio at 1.5, and its buffer at approximately two million pixels. It stops for reduced motion, hidden tabs and offscreen containers, and cleans up its GPU resources on unmount. A static fallback preserves the content if WebGL is unavailable.

### Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

### Visual reference

Inspired by [React Bits Plasma](https://reactbits.dev/backgrounds/plasma) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream source, shaders or assets are redistributed.

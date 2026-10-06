# PixelBlast

> Animations/Backgrounds/PixelBlast · animations · `@gaudi/design-system/animations/PixelBlast`

Separate square pixels form drifting dithered patterns; clicks send circular waves through the field.

## Import

```js
import PixelBlast from '@gaudi/design-system/animations/PixelBlast';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `PixelBlast`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, hidden tabs and offscreen surfaces also stop motion. |
| `speed` | `number` | `1` | no | Motion multiplier, clamped to 0–5. Zero keeps the current frame still. |
| `intensity` | `number` | `1` | no | Strength of the effect, clamped to 0–2. Zero shows only the background color. |
| `scale` | `number` | `1` | no | Scale changes the square size and spacing in CSS pixels, independent of device pixel ratio. Clamped to 0.25–4. |
| `colors` | `string[]` | `Gaudi chart colors 1–3` | no | Up to three CSS colors, including CSS variables. Omitted colors use the current Gaudi palette. |
| `background` | `string` | `var(--ds-color-surface)` | no | Base CSS color beneath the effect. Follows the current theme by default. |
| `interactive` | `boolean` | `true` | no | Create an outward-decaying ripple at each click or tap. No interaction is needed to use the content. |
| `height` | `number \| string` | `360` | no | Surface height in pixels or a CSS length. Numeric values are clamped to 1–4096. |
| `children` | `ReactNode` | — | no | Optional content rendered above the decorative canvas. Keep text and controls on a contrasting surface. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer div along with other DOM props and pointer handlers. |

## Usage

```jsx
import { PixelBlast } from '@gaudi/design-system/animations/PixelBlast';

<PixelBlast height={360} paused />
```

## Accessibility

The canvas is decorative and hidden from assistive technology; children remain accessible. Reduced motion shows a still frame, and unavailable graphics use a static color fallback. Provide a visible pause control when motion continues beside meaningful content. Keep text contrast independent of the moving artwork.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- Squares keep the same size as density changes. A click creates an outward-moving wave that fades; paused and reduced-motion surfaces do not respond.
- Visual idea inspired by Pixel Blast from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-pixel-blast--playground`)

## README

Separate square pixels form drifting dithered patterns; clicks send circular waves through the field.

```jsx
import { PixelBlast } from '@gaudi/design-system/animations/PixelBlast';

<PixelBlast height={360} paused />
```

- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen surfaces also stop motion.
- `speed` (number, default 1): Motion multiplier, clamped to 0–5. Zero keeps the current frame still.
- `intensity` (number, default 1): Strength of the effect, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Scale changes the square size and spacing in CSS pixels, independent of device pixel ratio. Clamped to 0.25–4.
- `colors` (string[], default Gaudi chart colors 1–3): Up to three CSS colors, including CSS variables. Omitted colors use the current Gaudi palette.
- `background` (string, default var(--ds-color-surface)): Base CSS color beneath the effect. Follows the current theme by default.
- `interactive` (boolean, default true): Create an outward-decaying ripple at each click or tap. No interaction is needed to use the content.
- `height` (number | string, default 360): Surface height in pixels or a CSS length. Numeric values are clamped to 1–4096.
- `children` (ReactNode, default —): Optional content rendered above the decorative canvas. Keep text and controls on a contrasting surface.
- `className / style / ref` (DOM props, default —): Applied to the outer div along with other DOM props and pointer handlers.

The canvas is decorative and hidden from assistive technology; children remain accessible. Reduced motion shows a still frame, and unavailable graphics use a static color fallback. Provide a visible pause control when motion continues beside meaningful content. Keep text contrast independent of the moving artwork.

Squares keep the same size as density changes. A click creates an outward-moving wave that fades; paused and reduced-motion surfaces do not respond.

Visual idea inspired by [Pixel Blast](https://reactbits.dev/backgrounds/pixel-blast) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

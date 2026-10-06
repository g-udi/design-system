# LightPillar

> Animations/Backgrounds/LightPillar · animations · `@gaudi/design-system/animations/LightPillar`

Irregular luminous ribbons flow through a broad diagonal column with bright cores and soft bloom.

## Import

```js
import LightPillar from '@gaudi/design-system/animations/LightPillar';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `LightPillar`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, hidden tabs and offscreen surfaces also stop motion. |
| `speed` | `number` | `1` | no | Motion multiplier, clamped to 0–5. Zero keeps the current frame still. |
| `intensity` | `number` | `1` | no | Strength of the effect, clamped to 0–2. Zero shows only the background color. |
| `scale` | `number` | `1` | no | Scale changes the column width. When interactive, pointer movement moves the column sideways. Clamped to 0.25–4. |
| `colors` | `string[]` | `Gaudi chart colors 1–3` | no | Up to three CSS colors, including CSS variables. Omitted colors use the current Gaudi palette. |
| `background` | `string` | `var(--ds-color-surface)` | no | Base CSS color beneath the effect. Follows the current theme by default. |
| `interactive` | `boolean` | `false` | no | Let pointer movement influence the decorative effect. No interaction is needed to use the content. |
| `height` | `number \| string` | `360` | no | Surface height in pixels or a CSS length. Numeric values are clamped to 1–4096. |
| `children` | `ReactNode` | — | no | Optional content rendered above the decorative canvas. Keep text and controls on a contrasting surface. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer div along with other DOM props and pointer handlers. |

## Usage

```jsx
import { LightPillar } from '@gaudi/design-system/animations/LightPillar';

<LightPillar height={360} paused />
```

## Accessibility

The canvas is decorative and hidden from assistive technology; children remain accessible. Reduced motion shows a still frame, and unavailable graphics use a static color fallback. Provide a visible pause control when motion continues beside meaningful content. Keep text contrast independent of the moving artwork.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- The ribbons continually change shape; their uneven highlights merge into the surrounding glow.
- Visual idea inspired by Light Pillar from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-light-pillar--playground`)

## README

Irregular luminous ribbons flow through a broad diagonal column with bright cores and soft bloom.

```jsx
import { LightPillar } from '@gaudi/design-system/animations/LightPillar';

<LightPillar height={360} paused />
```

- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen surfaces also stop motion.
- `speed` (number, default 1): Motion multiplier, clamped to 0–5. Zero keeps the current frame still.
- `intensity` (number, default 1): Strength of the effect, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Scale changes the column width. When interactive, pointer movement moves the column sideways. Clamped to 0.25–4.
- `colors` (string[], default Gaudi chart colors 1–3): Up to three CSS colors, including CSS variables. Omitted colors use the current Gaudi palette.
- `background` (string, default var(--ds-color-surface)): Base CSS color beneath the effect. Follows the current theme by default.
- `interactive` (boolean, default false): Let pointer movement influence the decorative effect. No interaction is needed to use the content.
- `height` (number | string, default 360): Surface height in pixels or a CSS length. Numeric values are clamped to 1–4096.
- `children` (ReactNode, default —): Optional content rendered above the decorative canvas. Keep text and controls on a contrasting surface.
- `className / style / ref` (DOM props, default —): Applied to the outer div along with other DOM props and pointer handlers.

The canvas is decorative and hidden from assistive technology; children remain accessible. Reduced motion shows a still frame, and unavailable graphics use a static color fallback. Provide a visible pause control when motion continues beside meaningful content. Keep text contrast independent of the moving artwork.

The ribbons continually change shape; their uneven highlights merge into the surrounding glow.

Visual idea inspired by [Light Pillar](https://reactbits.dev/backgrounds/light-pillar) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

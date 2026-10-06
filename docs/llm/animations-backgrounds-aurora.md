# Aurora

> Animations/Backgrounds/Aurora · animations · `@gaudi/design-system/layout/Borealis`

Theme-aware Aurora light curtains, with a Soft Aurora variant that forms a narrow glowing ribbon.

## Import

```js
import Aurora from '@gaudi/design-system/layout/Borealis';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"aurora" \| "soft"` | `aurora` | no | Top-lit curtains or a soft horizontal ribbon. Unknown values fall back to aurora. |
| `amplitude` | `number` | `1` | no | Height variation of the light, clamped to 0–2. |
| `blend` | `number` | `0.5` | no | Softness of the glow, clamped to 0–1. |
| `fadeEdges` | `boolean` | `true` | no | Fade the decorative layer into the page at its lower edge. |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation. |
| `speed` | `number` | `1` | no | Animation speed multiplier, clamped to 0–5. Zero holds a static frame. |
| `intensity` | `number` | `1` | no | Effect strength, clamped to 0–2. Zero reveals the background color. |
| `scale` | `number` | `1` | no | Spatial scale of the effect, clamped to 0.25–4. |
| `colors` | `string[]` | `Gaudi theme tokens` | no | Up to three CSS colors. Omitted colors inherit the current Gaudi palette. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect and its static fallback. |
| `height` | `number \| string` | `content / viewport` | no | Optional fixed height in pixels or CSS length. Without it, the existing page wrapper grows with content and fills at least the viewport; decoration is capped at 48rem. |
| `children` | `ReactNode` | — | no | Optional semantic content layered above the decorative canvas. |
| `className / style / ref / DOM props` | `DOM props` | — | no | Forwarded to the outer container. |

## Variants

- `variant`: `aurora`, `soft`

## Usage

```jsx
import Borealis from '@gaudi/design-system/animations/Borealis';

<Borealis variant="soft" height={500}>{content}</Borealis>
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- Borealis remains the public component name. Existing layout imports, direct children, outer ref, and page layout are preserved. Soft Aurora is selected with variant="soft".
- Visual ideas inspired by React Bits Aurora and Soft Aurora (MIT + Commons Clause). Independently authored for Gaudi; no upstream source, shaders or assets are included.

## Examples

- Aurora (Storybook `layout-components--borealis-surface`)
- Soft Aurora (Storybook `layout-borealis--soft-aurora`)

## README

Theme-aware Aurora light curtains, with a Soft Aurora variant that forms a narrow glowing ribbon.

```jsx
import Borealis from '@gaudi/design-system/animations/Borealis';

<Borealis variant="soft" height={500}>{content}</Borealis>
```

Existing root, layout barrel and `@gaudi/design-system/layout/Borealis` imports remain supported. Direct children and the ref stay on the outer page wrapper. Without a height, the wrapper grows with content and fills at least the viewport; the decoration is capped at 48rem.

### Contract

- `variant` ("aurora" | "soft", default `aurora`): Top-lit curtains or a soft horizontal ribbon. Unknown values fall back to aurora.
- `amplitude` (number, default `1`): Height variation of the light, clamped to 0–2.
- `blend` (number, default `0.5`): Softness of the glow, clamped to 0–1.
- `fadeEdges` (boolean, default `true`): Fade the decorative layer into the page at its lower edge.
- `paused` (boolean, default `false`): Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation.
- `speed` (number, default `1`): Animation speed multiplier, clamped to 0–5. Zero holds a static frame.
- `intensity` (number, default `1`): Effect strength, clamped to 0–2. Zero reveals the background color.
- `scale` (number, default `1`): Spatial scale of the effect, clamped to 0.25–4.
- `colors` (string[], default `Gaudi theme tokens`): Up to three CSS colors. Omitted colors inherit the current Gaudi palette.
- `background` (string, default `var(--ds-color-surface)`): CSS color behind the effect and its static fallback.
- `height` (number | string, default `content / viewport`): Optional fixed height in pixels or CSS length. Without it, the existing page wrapper grows with content and fills at least the viewport; decoration is capped at 48rem.
- `children` (ReactNode, default `—`): Optional semantic content layered above the decorative canvas.
- `className / style / ref / DOM props` (DOM props, default `—`): Forwarded to the outer container.

### Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

### Visual references

Inspired by [React Bits Aurora](https://reactbits.dev/backgrounds/aurora) and [Soft Aurora](https://reactbits.dev/backgrounds/soft-aurora) (MIT + Commons Clause). Independently authored for Gaudi; no upstream source, shaders or assets are included.

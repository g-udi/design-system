# LiquidEther

> Animations/Backgrounds/LiquidEther · animations · `@gaudi/design-system/animations/LiquidEther`

Colored dye follows pointer movement, curls through a retained velocity field, and gradually dissipates.

## Import

```js
import LiquidEther from '@gaudi/design-system/animations/LiquidEther';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `LiquidEther`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation. |
| `speed` | `number` | `1` | no | Animation speed multiplier, clamped to 0–5. Zero holds a static frame. |
| `intensity` | `number` | `1` | no | Effect strength, clamped to 0–2. Zero reveals the background color. |
| `scale` | `number` | `1` | no | Spatial scale of the effect, clamped to 0.25–4. |
| `colors` | `string[]` | `Gaudi theme tokens` | no | Up to three CSS colors. Omitted colors inherit the current Gaudi palette. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect and its static fallback. |
| `interactive` | `boolean` | `true` | no | Inject persistent dye and momentum along pointer movement. Holding the pointer adds more dye while moving; clicks and scrolling remain available to content. |
| `height` | `number \| string` | `360` | no | Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container. |
| `children` | `ReactNode` | — | no | Optional semantic content layered above the decorative canvas. |
| `className / style / ref / DOM props` | `DOM props` | — | no | Forwarded to the outer container. |

## Usage

```jsx
import { LiquidEther } from '@gaudi/design-system/animations/LiquidEther';

<LiquidEther height={360} paused={false} />
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- A bounded velocity and dye simulation retains, transports, and dissipates each plume. Pointer movement adds dye and momentum; an autonomous drifting source runs when the pointer is absent. Pausing and zero-delta redraws preserve the field, and a seeded plume provides a deterministic reduced-motion still.
- Visual idea inspired by Liquid Ether from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-liquid-ether--playground`)

## Related

`core-pointer`

## README

Colored dye follows pointer movement, curls through a retained velocity field, and gradually dissipates.

```jsx
import { LiquidEther } from '@gaudi/design-system/animations/LiquidEther';

<LiquidEther height={360} speed={1} intensity={1} interactive />
```

A bounded velocity and dye simulation retains, transports, and dissipates each plume. Pointer movement adds dye and momentum; an autonomous drifting source runs when the pointer is absent. Pausing and zero-delta redraws preserve the field, and a seeded plume provides a deterministic reduced-motion still.

### Contract

- `paused=false` freezes the current frame when enabled. `speed=1` accepts 0–5; zero stops time.
- `intensity=1` accepts 0–2. `scale=1` accepts 0.25–4. Invalid numbers use safe defaults.
- `colors` optionally supplies up to three CSS colors; defaults come from the current Gaudi theme. `background` defaults to `var(--ds-color-surface)`.
- `interactive=true` injects dye along pointer movement; set it to false for autonomous motion only. Content and controls retain their normal pointer behavior.
- `height=360` accepts pixels or a CSS length; numeric values are clamped to 1–4096. The canvas fills its container with a device pixel ratio capped at 1.5 and a drawing buffer of approximately two million pixels at most.
- `children`, `className`, `style`, `ref` and DOM attributes belong to the outer container. Children render above the canvas.

The shared renderer pauses for reduced motion, hidden tabs and offscreen containers, and releases its observers, animation frame and WebGL resources on unmount. Server output is deterministic. A static styled background remains available when WebGL fails.

### Accessibility

The canvas is decorative and hidden from assistive technology. Keep meaningful text and controls in semantic children. Provide a pause control for continuous motion and maintain text contrast when layering content over the effect.

### Visual reference

Inspired by the visual idea of [React Bits Liquid Ether](https://reactbits.dev/backgrounds/liquid-ether) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream component source, shader or asset is redistributed.

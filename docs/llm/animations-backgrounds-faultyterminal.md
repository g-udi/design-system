# FaultyTerminal

> Animations/Backgrounds/FaultyTerminal · animations · `@gaudi/design-system/animations/FaultyTerminal`

A curved phosphor display of changing pixel glyphs, scanlines and intermittent signal faults.

## Import

```js
import FaultyTerminal from '@gaudi/design-system/animations/FaultyTerminal';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `FaultyTerminal`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `digitSize` | `number` | `1` | no | Glyph cell size multiplier, clamped to 0.5–3. |
| `curvature` | `number` | `0.1` | no | CRT curvature, clamped to 0–1. |
| `scanlines` | `number` | `0.5` | no | Scanline contrast, clamped to 0–1. |
| `glitch` | `number` | `1` | no | Intermittent horizontal displacement, clamped to 0–2. |
| `paused` | `boolean` | `false` | no | Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation. |
| `speed` | `number` | `1` | no | Animation speed multiplier, clamped to 0–5. Zero holds a static frame. |
| `intensity` | `number` | `1` | no | Effect strength, clamped to 0–2. Zero reveals the background color. |
| `scale` | `number` | `1` | no | Spatial scale of the effect, clamped to 0.25–4. |
| `colors` | `string[]` | `Gaudi theme tokens` | no | The first CSS color supplies the tint; omitted colors inherit Gaudi theme tokens. |
| `background` | `string` | `var(--ds-color-surface)` | no | CSS color behind the effect and its static fallback. |
| `interactive` | `boolean` | `true` | no | Let pointer position influence the effect without capturing clicks or scrolling. |
| `height` | `number \| string` | `360` | no | Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container. |
| `children` | `ReactNode` | — | no | Optional semantic content layered above the decorative canvas. |
| `className / style / ref / DOM props` | `DOM props` | — | no | Forwarded to the outer container. |

## Usage

```jsx
import { FaultyTerminal } from '@gaudi/design-system/animations/FaultyTerminal';

<FaultyTerminal height={500} paused={false} />
```

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

## Notes

- The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.
- Procedural squares, crosses and diamonds change with a moving field. The first colors entry supplies the phosphor tint. Pointer proximity brightens local glyphs; the canvas is decorative, not a terminal emulator.
- Visual idea inspired by FaultyTerminal from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included.

## Examples

- Playground (Storybook `animations-backgrounds-faulty-terminal--playground`)

## Related

`core-pointer`

## README

A curved phosphor display of changing pixel glyphs, scanlines and intermittent signal faults.

```jsx
import { FaultyTerminal } from '@gaudi/design-system/animations/FaultyTerminal';

<FaultyTerminal height={500} paused={false} />
```

Procedural squares, crosses and diamonds change with a moving field. The first colors entry supplies the phosphor tint. Pointer proximity brightens local glyphs; the canvas is decorative, not a terminal emulator.

### Contract

- `digitSize` (number, default `1`): Glyph cell size multiplier, clamped to 0.5–3.
- `curvature` (number, default `0.1`): CRT curvature, clamped to 0–1.
- `scanlines` (number, default `0.5`): Scanline contrast, clamped to 0–1.
- `glitch` (number, default `1`): Intermittent horizontal displacement, clamped to 0–2.
- `paused` (boolean, default `false`): Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation.
- `speed` (number, default `1`): Animation speed multiplier, clamped to 0–5. Zero holds a static frame.
- `intensity` (number, default `1`): Effect strength, clamped to 0–2. Zero reveals the background color.
- `scale` (number, default `1`): Spatial scale of the effect, clamped to 0.25–4.
- `colors` (string[], default `Gaudi theme tokens`): The first CSS color supplies the tint; omitted colors inherit Gaudi theme tokens.
- `background` (string, default `var(--ds-color-surface)`): CSS color behind the effect and its static fallback.
- `interactive` (boolean, default `true`): Let pointer position influence the effect without capturing clicks or scrolling.
- `height` (number | string, default `360`): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default `—`): Optional semantic content layered above the decorative canvas.
- `className / style / ref / DOM props` (DOM props, default `—`): Forwarded to the outer container.

The shared renderer caps drawing at 30fps, device pixel ratio at 1.5, and its buffer at approximately two million pixels. It stops for reduced motion, hidden tabs and offscreen containers, and cleans up its GPU resources on unmount. A static fallback preserves the content if WebGL is unavailable.

### Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

### Visual reference

Inspired by [React Bits FaultyTerminal](https://reactbits.dev/backgrounds/faulty-terminal) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream source, shaders or assets are redistributed.

# FaultyTerminal

A curved phosphor display of changing pixel glyphs, scanlines and intermittent signal faults.

```jsx
import { FaultyTerminal } from '@gaudi/design-system/animations/FaultyTerminal';

<FaultyTerminal height={500} paused={false} />
```

Procedural squares, crosses and diamonds change with a moving field. The first colors entry supplies the phosphor tint. Pointer proximity brightens local glyphs; the canvas is decorative, not a terminal emulator.

## Contract

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

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

## Visual reference

Inspired by [React Bits FaultyTerminal](https://reactbits.dev/backgrounds/faulty-terminal) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream source, shaders or assets are redistributed.

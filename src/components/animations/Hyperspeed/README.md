# Hyperspeed

Paired light trails travel along a curving road and accelerate while the background is held.

```jsx
import { Hyperspeed } from '@gaudi/design-system/animations/Hyperspeed';

<Hyperspeed height={500} paused={false} />
```

Two opposing streams of paired lights follow a perspective road. Hold a non-interactive part of the background to accelerate smoothly; releasing slows it down without jumping its position. Use speed for a keyboard-accessible or controlled alternative.

## Contract

- `curvature` (number, default `1`): Road bend strength, clamped to 0–2.
- `trailLength` (number, default `1.5`): Light trail length, clamped to 0.25–4.
- `paused` (boolean, default `false`): Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation.
- `speed` (number, default `1`): Animation speed multiplier, clamped to 0–5. Zero holds a static frame.
- `intensity` (number, default `1`): Effect strength, clamped to 0–2. Zero reveals the background color.
- `scale` (number, default `1`): Spatial scale of the effect, clamped to 0.25–4.
- `colors` (string[], default `Gaudi theme tokens`): Up to three CSS colors. Omitted colors inherit the current Gaudi palette.
- `background` (string, default `var(--ds-color-surface)`): CSS color behind the effect and its static fallback.
- `interactive` (boolean, default `true`): Let pointer position influence the effect without capturing clicks or scrolling.
- `height` (number | string, default `360`): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default `—`): Optional semantic content layered above the decorative canvas.
- `className / style / ref / DOM props` (DOM props, default `—`): Forwarded to the outer container.

The shared renderer caps drawing at 30fps, device pixel ratio at 1.5, and its buffer at approximately two million pixels. It stops for reduced motion, hidden tabs and offscreen containers, and cleans up its GPU resources on unmount. A static fallback preserves the content if WebGL is unavailable.

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

## Visual reference

Inspired by [React Bits Hyperspeed](https://reactbits.dev/backgrounds/hyperspeed) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream source, shaders or assets are redistributed.

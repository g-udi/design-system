# ParticleSea

A rolling sea of fine points seen in perspective; crests catch the light and glitter.

```jsx
import { ParticleSea } from '@gaudi/design-system/animations/ParticleSea';

<ParticleSea height={500} waveHeight={1.2} colors={['var(--ds-color-warning)']} />
```

Points are spaced evenly across the water, so they shrink and crowd towards the horizon. Only crests are lit, and each point twinkles on its own phase. Points too small to resolve fade out instead of shimmering. Change `waveHeight` or `speed` to give different content its own sea.

## Contract

- `waveHeight` (number, default `1`): Swell height, clamped to 0–2. Higher seas light more crests.
- `density` (number, default `1`): Points per unit of water, clamped to 0.25–2.
- `horizon` (number, default `0.75`): Horizon position from the bottom of the container, clamped to 0.3–1. The area above it shows the background.
- `paused` (boolean, default `false`): Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation.
- `speed` (number, default `1`): Animation speed multiplier, clamped to 0–5. Zero holds a static frame.
- `intensity` (number, default `1`): Brightness of the lit points, clamped to 0–2. Zero reveals the background color.
- `scale` (number, default `1`): Spatial scale of the sea, clamped to 0.25–4.
- `colors` (string[], default `Gaudi theme tokens`): Up to three CSS colors for the points. Omitted colors inherit the current Gaudi palette.
- `background` (string, default `var(--ds-color-surface)`): CSS color behind the effect and its static fallback.
- `interactive` (boolean, default `false`): Lift the sea under the pointer without capturing clicks or scrolling.
- `height` (number | string, default `360`): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default `—`): Optional semantic content layered above the decorative canvas.
- `className / style / ref / DOM props` (DOM props, default `—`): Forwarded to the outer container.

The shared renderer caps drawing at 30fps, device pixel ratio at 1.5, and its buffer at approximately two million pixels. It stops for reduced motion, hidden tabs and offscreen containers, and cleans up its GPU resources on unmount. A static fallback preserves the content if WebGL is unavailable.

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.

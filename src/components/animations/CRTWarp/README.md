# CRTWarp

Cellular plasma islands split and reconnect through broad stepped phosphor contours, curved scanlines, and analog grain.

```jsx
import { CRTWarp } from '@gaudi/design-system/animations/CRTWarp';

<CRTWarp height={360} speed={1} intensity={1} interactive />
```

Two displaced fields drift independently to form irregular islands that merge and separate. Several nested brightness bands preserve dark space between saturated cores; separated phosphor channels and a continuous halo soften the coarse contours. Signal cells use CSS pixels, and barrel curvature bends both the field and its fine scanlines. Grain covers the whole signal, including dark areas. Pointer motion locally bends the field when `interactive` is enabled. The supplied palette remains visible without washing every core toward white.

## Contract

- `paused=false` freezes the current frame when enabled. `speed=1` accepts 0–5; zero stops time.
- `intensity=1` accepts 0–2. `scale=1` accepts 0.25–4. Invalid numbers use safe defaults.
- `colors` optionally supplies up to three CSS colors; defaults come from the current Gaudi theme. `background` defaults to `var(--ds-color-surface)`.
- `interactive=false` enables pointer response when set. Content and controls retain their normal pointer behavior.
- `height=360` accepts pixels or a CSS length; numeric values are clamped to 1–4096. The canvas fills its container with a device pixel ratio capped at 1.5 and a drawing buffer of approximately two million pixels at most.
- `children`, `className`, `style`, `ref` and DOM attributes belong to the outer container. Children render above the canvas.

The shared renderer pauses for reduced motion, hidden tabs and offscreen containers, and releases its observers, animation frame and WebGL resources on unmount. Server output is deterministic. A static styled background remains available when WebGL fails.

## Accessibility

The canvas is decorative and hidden from assistive technology. Keep meaningful text and controls in semantic children. Provide a pause control for continuous motion and maintain text contrast when layering content over the effect.

## Visual reference

Inspired by the visual idea of [React Bits CRT Warp](https://reactbits.dev/backgrounds/crt-warp) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream component source, shader or asset is redistributed.

# GradientWaves

Broad, softly lit swells roll toward a hazy horizon, with atmospheric depth and subtle pointer parallax.

```jsx
import { GradientWaves } from '@gaudi/design-system/animations/GradientWaves';

<GradientWaves height={360} speed={1} intensity={1} interactive />
```

The shader traces a continuous height field with broad foreground swells. Surface lighting and distance haze soften receding crests; pointer movement subtly shifts the viewpoint.

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

Inspired by the visual idea of [React Bits Gradient Waves](https://reactbits.dev/backgrounds/gradient-waves) (MIT + Commons Clause). This is an independent Gaudi implementation; no upstream component source, shader or asset is redistributed.

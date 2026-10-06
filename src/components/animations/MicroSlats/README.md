# MicroSlats

Rounded 10×25px slats catch broad rolling swells, crest glints and a fading pointer wake.

```jsx
import { MicroSlats } from '@gaudi/design-system/animations/MicroSlats';

<MicroSlats height={500} paused={paused} />
```

- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation.
- `speed` (number, default 0.6): Playback multiplier from 0 to 5. Zero freezes time.
- `intensity` (number, default 1): Brightness of the slats, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Spatial scale from 0.25 to 4. Larger values produce larger details.
- `colors` (string[], default Gaudi theme colors): Up to three CSS colors. Omit to follow the current Gaudi theme.
- `background` (string, default var(--ds-color-surface)): CSS color behind the effect, also used by the static fallback.
- `interactive` (boolean, default true): Moving the pointer leaves fading light; clicking sends a spreading ripple. Input stops while motion is paused.
- `height` (number | string, default 360): Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container.
- `children` (ReactNode, default —): Accessible foreground content layered above the decorative canvas.
- `className / style / ref` (DOM props, default —): Applied to the outer div. Standard DOM attributes and handlers are forwarded.

The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.

Scale changes slat dimensions; slat height stays fixed through each swell.

Visual idea inspired by [MicroSlats](https://reactbits.dev/backgrounds/micro-slats) from [React Bits](https://reactbits.dev). Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included.

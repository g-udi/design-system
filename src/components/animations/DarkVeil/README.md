# DarkVeil

Broad illuminated folds drift across a dark surface, with sharp creases and deep intervening shadows.

```jsx
import { DarkVeil } from '@gaudi/design-system/animations/DarkVeil';

<DarkVeil height={360} paused />
```

- `paused` (boolean, default false): Freeze the current frame. Reduced motion, hidden tabs and offscreen surfaces also stop motion.
- `speed` (number, default 1): Motion multiplier, clamped to 0–5. Zero keeps the current frame still.
- `intensity` (number, default 1): Strength of the effect, clamped to 0–2. Zero shows only the background color.
- `scale` (number, default 1): Scale changes the breadth of the folded sheets. When interactive, pointer movement gently offsets the folds. Clamped to 0.25–4.
- `colors` (string[], default Gaudi chart colors 1–3): Up to three CSS colors, including CSS variables. Omitted colors use the current Gaudi palette.
- `background` (string, default var(--ds-color-surface)): Base CSS color beneath the effect. Follows the current theme by default.
- `interactive` (boolean, default false): Let pointer movement influence the decorative effect. No interaction is needed to use the content.
- `height` (number | string, default 360): Surface height in pixels or a CSS length. Numeric values are clamped to 1–4096.
- `children` (ReactNode, default —): Optional content rendered above the decorative canvas. Keep text and controls on a contrasting surface.
- `className / style / ref` (DOM props, default —): Applied to the outer div along with other DOM props and pointer handlers.

The canvas is decorative and hidden from assistive technology; children remain accessible. Reduced motion shows a still frame, and unavailable graphics use a static color fallback. Provide a visible pause control when motion continues beside meaningful content. Keep text contrast independent of the moving artwork.

Smooth, asymmetric sheets gather light along their creases and remain dark on the opposite side.

Visual idea inspired by [Dark Veil](https://reactbits.dev/backgrounds/dark-veil) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

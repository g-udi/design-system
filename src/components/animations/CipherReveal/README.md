# CipherReveal

Scrambled characters resolve progressively into readable text on view, hover or focus.

```jsx
import { CipherReveal } from '@gaudi/design-system/animations/CipherReveal';

<CipherReveal text="Gaudi" />
```

- `text` (string, default "Ideas into interfaces"): Text to display. Short phrases work best; long text can wrap.
- `duration` (number, default 1200): Reveal duration in milliseconds, clamped to 100–10000.
- `direction` (start | end | center, default "start"): Order in which the original letters are revealed.
- `trigger` (view | hover, default "view"): Begin on entering view, or wait for hover/focus. Hover and focus can replay either mode.
- `characterSet` (string, default "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"): Glyphs used for the decorative character rendering. Empty input uses a safe fallback.
- `paused` (boolean, default false): Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it.
- `className / style / ref` (DOM props, default —): Applied to the outer span. Typography is inherited.

The complete text is exposed once; scrambled characters are hidden from assistive technology. Pausing or reduced motion reveals the complete text. The outer span has no tab stop by default; focus replay applies when it receives focus.

Visual idea inspired by [Decrypted Text](https://reactbits.dev/text-animations/decrypted-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

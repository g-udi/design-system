# WordSpotlight

A moving set of corner marks brings one word into focus while the surrounding words soften.

```jsx
import { WordSpotlight } from '@gaudi/design-system/animations/WordSpotlight';

<WordSpotlight text="Gaudi" />
```

- `text` (string, default "Focus on what matters"): Words to display. Whitespace separates words, which wrap within the container.
- `interval` (number, default 1800): Milliseconds between automatic word changes, clamped to 400–30000. Hover holds the selected word.
- `blur` (number, default 4): Blur radius of unfocused words in pixels, 0–10. Reduced motion renders all words clearly.
- `paused` (boolean, default false): Stop automatic word changes; hover can still select a word. Reduced motion, hidden tabs and offscreen containers also stop automatic changes.
- `className / style / ref` (DOM props, default —): Applied to the outer span. Typography is inherited.

The complete text is exposed once; decorative words are hidden from assistive technology. Reduced motion removes blur and corner marks. Pausing stops automatic changes while retaining the current visual focus. Provide a pause control for continuous cycling.

Visual idea inspired by [True Focus](https://reactbits.dev/text-animations/true-focus) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

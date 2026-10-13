# PhraseCycle

A sequence of phrases rotates vertically in a stable space, without moving the surrounding line.

```jsx
import { PhraseCycle } from '@gaudi/design-system/animations/PhraseCycle';

<PhraseCycle texts={["Create", "Explore"]} />
```

- `texts` (string[], default ["thoughtfully", "boldly", "together"]): Phrases to display in order. All phrases are included once in the accessible text.
- `interval` (number, default 2200): Milliseconds between phrase changes, clamped to 700–30000. Each transition uses the focal motion duration (560 ms).
- `direction` (up | down, default "up"): Direction of the vertical transition.
- `paused` (boolean, default false): Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it.
- `className / style / ref` (DOM props, default —): Applied to the outer span. Typography is inherited.

All phrases are exposed once as stable text, without a live region. Reduced motion shows the first phrase. Pausing keeps the current phrase visible. Provide a pause control for continuous cycling.

Visual idea inspired by [Rotating Text](https://reactbits.dev/text-animations/rotating-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

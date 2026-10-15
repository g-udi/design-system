# ReelText

A formatted value whose digits spin into place on slot-machine reels. Use it for figures that change in place, such as a metric switching period; it is how `StatCard` animates its value with `valueMotion='reel'`.

```jsx
import { ReelText } from '@gaudi/design-system/animations/ReelText';

<ReelText value='$31,904' />
```

Pass the value already formatted. Each digit is a 0–9 reel that rolls to its digit with a fast start and a soft landing (`--ds-motion-ease-out`); reels land left to right, `stagger` milliseconds apart, the first after `duration`. Separators, currency signs and letters stay fixed, and characters are matched from the end, so `999` → `1,000` spins only digits. The first paint rolls up from zero.

The root is one image with the whole value as its accessible name; the reels are hidden from assistive technology. Reduced motion, `paused`, hidden tabs and offscreen containers swap the value without motion.

Motion inspired by Arc's Slot text.

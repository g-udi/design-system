# ReelText

> Animations/Text/ReelText · animations · `@gaudi/design-system/animations/ReelText`

A formatted value whose digits spin into place on slot-machine reels, landing left to right.

## Import

```js
import ReelText from '@gaudi/design-system/animations/ReelText';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `ReelText`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | `""` | no | The value to show, already formatted. Digits become reels; every other character stays fixed. |
| `duration` | `number` | `900` | no | Milliseconds the first reel takes to land, clamped to 0–4000. |
| `stagger` | `number` | `70` | no | Milliseconds between consecutive reels landing, left to right, clamped to 0–400. |
| `paused` | `boolean` | `false` | no | Swap values without motion. System reduced motion, hidden tabs and offscreen containers do the same. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer span. Typography is inherited. |

## Usage

```jsx
import { ReelText } from '@gaudi/design-system/animations/ReelText';

<ReelText value="$31,904" />
```

## Accessibility

The root is one image named with the whole value; the reels are hidden, so the value is read once and never digit by digit. Reduced motion swaps values instantly.

## Notes

- Motion inspired by [Slot text](https://uiarc.dev/components/slot-text) from Arc. Independently implemented for Gaudi; no Arc code or assets are included.

## Examples

- Playground (Storybook `animations-text-reeltext--playground`)
- Changing value (Storybook `animations-text-reeltext--changing-value`)

## README

A formatted value whose digits spin into place on slot-machine reels. Use it for figures that change in place, such as a metric switching period; it is how `StatCard` animates its value with `valueMotion='reel'`.

```jsx
import { ReelText } from '@gaudi/design-system/animations/ReelText';

<ReelText value='$31,904' />
```

Pass the value already formatted. Each digit is a 0–9 reel that rolls to its digit with a fast start and a soft landing (`--ds-motion-ease-out`); reels land left to right, `stagger` milliseconds apart, the first after `duration`. Separators, currency signs and letters stay fixed, and characters are matched from the end, so `999` → `1,000` spins only digits. The first paint rolls up from zero.

The root is one image with the whole value as its accessible name; the reels are hidden from assistive technology. Reduced motion, `paused`, hidden tabs and offscreen containers swap the value without motion.

Motion inspired by Arc's Slot text.

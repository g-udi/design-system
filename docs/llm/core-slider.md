# Slider

> Core/Slider · core · `@gaudi/design-system/core/Slider`

Adjust one value or a range with pointer and keyboard input.

## Import

```js
import { Slider } from '@gaudi/design-system/core/Slider';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Slider`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `getValueText` | `(value, index) => string` | — | no | Text a thumb announces instead of the number, such as a level name; use it with a controlled value. |
| `value / defaultValue` | `number[]` | — | no | Controlled or initial thumb positions. |
| `onValueChange / onValueCommit` | `(values: number[]) => void` | — | no | Continuous updates or the committed selection. |
| `min / max` | `number` | `0 / 100` | no | Allowed range. |
| `step` | `number` | `1` | no | Keyboard and pointer increment. |
| `orientation` | `horizontal \| vertical` | `horizontal` | no | Control orientation. |
| `disabled` | `boolean` | `false` | no | Prevent adjustment. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `orientation`: `horizontal`, `vertical`

## Usage

```jsx
import { Slider } from '@gaudi/design-system/core/Slider';

<Slider aria-label='Volume' value={volume} onValueChange={setVolume} min={0} max={100} />
```

## Accessibility

Label every thumb and provide a readable value. Use range examples when the two endpoints have different meanings.

## Examples

- Playground (Storybook `core-slider--playground`)

Curated patterns:

- Paired with a number field — registry item `@gaudi/slider-number-sync` (uses `Label`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `Slider`)
- Custom readouts — registry item `@gaudi/slider-readouts` (uses `Label`, `Slider`)
- Scale labels and ticks — registry item `@gaudi/slider-scale-ticks` (uses `Label`, `Slider`, `cn`)
- Thumbs and states — registry item `@gaudi/slider-thumbs-states` (uses `Slider`)

## README

Picks a value, or a range with two thumbs, by dragging along a track. Use it for approximate settings such as volume or a price range; use a NumberField when the exact number matters.

### Usage

```jsx
import { Slider } from '@gaudi/design-system';

<Slider aria-label='Volume' defaultValue={[50]} min={0} max={100} step={5} onValueChange={setVolume} />;
```

Pass two values for a range. `orientation` is `horizontal` or `vertical`.

### Accessibility

Each thumb is a `slider` named from `aria-label` (numbered for ranges). Arrow keys step the value, Home and End jump to the ends. Show the current value as text next to the slider.

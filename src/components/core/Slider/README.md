# Slider

Picks a value, or a range with two thumbs, by dragging along a track. Use it for approximate settings such as volume or a price range; use a NumberField when the exact number matters.

## Usage

```jsx
import { Slider } from '@gaudi/design-system';

<Slider aria-label='Volume' defaultValue={[50]} min={0} max={100} step={5} onValueChange={setVolume} />;
```

Pass two values for a range. `orientation` is `horizontal` or `vertical`.

## Accessibility

Each thumb is a `slider` named from `aria-label` (numbered for ranges). Arrow keys step the value, Home and End jump to the ends. Show the current value as text next to the slider.

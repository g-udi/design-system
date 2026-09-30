# NumberField

A numeric input with step buttons, for quantities, durations and prices within a known range. Use a Slider when an approximate value is enough.

## Usage

```jsx
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput, NumberFieldScrubArea } from '@gaudi/design-system';

<NumberField defaultValue={5} min={0} max={10} step={1}>
  <NumberFieldScrubArea label='Articles per week' />
  <NumberFieldGroup>
    <NumberFieldDecrement aria-label='Decrease' />
    <NumberFieldInput />
    <NumberFieldIncrement aria-label='Increase' />
  </NumberFieldGroup>
</NumberField>;
```

`size` (`sm`, `default`, `lg`) sets the control height, and `format` takes `Intl.NumberFormat` options for units and currency.

## Accessibility

Arrow keys step the value, Home and End jump to `min` and `max`, and typed values clamp on blur. Give the step buttons an `aria-label`.

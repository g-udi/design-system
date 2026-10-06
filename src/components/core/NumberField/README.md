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

Inside `Field`, the input automatically receives its label ID, description and error state. Use an explicit root `id` when composing primitive labels.

The editor is text-based, so it inherits `InputConfigProvider` smooth caret mode. Use `NumberFieldInput caretMode='native'` or `caretMode='smooth'` for an individual override. Prefer this component to `Input type='number'` when you need smooth caret movement with numeric bounds, stepping and formatting. The native number input does not expose its caret position.

## Accessibility

Arrow keys step the value, Home and End jump to `min` and `max`, and typed values clamp on blur. Give the step buttons an `aria-label`.

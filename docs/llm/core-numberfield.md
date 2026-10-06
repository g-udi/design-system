# NumberField

> Core/NumberField · core · `@gaudi/design-system/core/NumberField`

Numeric entry with increment buttons, bounds, locale formatting and scrubbing.

## Import

```js
import { NumberField } from '@gaudi/design-system/core/NumberField';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldScrubArea`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value / defaultValue / onValueChange` | `number \| null / function` | — | no | Controlled or initial numeric value and change callback. |
| `min / max / step` | `number` | — | no | Numeric bounds and increment. |
| `size` | `sm \| default \| lg` | `default` | no | Shared size for input, group and buttons. |
| `format / locale` | `Intl.NumberFormatOptions / string` | — | no | Number formatting and locale. |
| `disabled / readOnly / required` | `boolean` | — | no | Interaction and form state. |
| `NumberFieldScrubArea.label` | `ReactNode` | — | no | Visible label associated with the generated input ID. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `size`: `sm`, `default`, `lg`

## Usage

```jsx
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement } from '@gaudi/design-system/core/NumberField';

<NumberField value={quantity} onValueChange={setQuantity} min={1}>
  <NumberFieldGroup><NumberFieldDecrement /><NumberFieldInput aria-label='Quantity' /><NumberFieldIncrement /></NumberFieldGroup>
</NumberField>
```

## Accessibility

Compose the input and increment/decrement parts inside NumberField. Base UI preserves spinbutton semantics and keyboard adjustment.

## Notes

- The text editor inherits InputConfigProvider. Set caretMode="native" or caretMode="smooth" on NumberFieldInput to override the provider. Numeric parsing, formatting, bounds and stepping stay with NumberField.

## Examples

- Playground (Storybook `core-numberfield--playground`)
- Controlled (Storybook `core-numberfield--controlled`)

Curated patterns:

- Button layouts — registry item `@gaudi/number-field-button-layouts` (uses `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldScrubArea`, `RegistryIcon`)
- Form validation — registry item `@gaudi/number-field-validation` (uses `AlertDescriptionPrimitive`, `AlertRoot`, `Button`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSet`, `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `RegistryIcon`, `ToastProvider`, `toast`)

## README

A numeric input with step buttons, for quantities, durations and prices within a known range. Use a Slider when an approximate value is enough.

### Usage

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

### Accessibility

Arrow keys step the value, Home and End jump to `min` and `max`, and typed values clamp on blur. Give the step buttons an `aria-label`.

# Field

> Core/Field · core · `@gaudi/design-system/core/Field`

Field composes form label, description, error, and input building blocks.

## Import

```js
import Field from '@gaudi/design-system/core/Field';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Field`, `FieldContent`, `FieldDescription`, `FieldDescriptionPrimitive`, `FieldError`, `FieldErrorPrimitive`, `FieldGroup`, `FieldInput`, `FieldLabel`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSeparator`, `FieldSet`, `FieldTitle`, `Label`, `default`

## When to use

- Use a persistent FieldLabel; placeholders are examples, not labels.
- Put requirements and recovery text next to the field before submission.
- Use FieldError and aria-invalid for invalid states instead of relying on red borders alone.

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `caretMode` | `native \| smooth` | `provider / smooth` | no | FieldInput overrides the nearest InputConfigProvider. Native editing stays intact. |
| `children` | `ReactNode` | — | no | Composes label, input, description, and error slots or supplies slot text. |
| `htmlFor` | `string` | — | no | Connects the visible label to the input id. |
| `id` | `string` | — | no | Input id paired with FieldLabel htmlFor. |
| `type` | `string` | `text` | no | Native input type. |
| `name` | `string` | — | no | Native input name for form submission. |
| `value` | `string` | — | no | Controlled input value. |
| `defaultValue` | `string` | — | no | Initial uncontrolled input value. |
| `placeholder` | `string` | — | no | Native input placeholder. |
| `required` | `boolean` | `false` | no | Marks the input as required. |
| `invalid` | `boolean` | `true when a FieldError is rendered` | no | Forces aria-invalid and the error border on FieldInput. |
| `disabled` | `boolean` | `false` | no | Disables the input. |
| `onChange` | `(event) => void` | — | no | Native input change handler. |
| `className` | `string` | — | no | Class override on each Field slot. |

## Variants

- `caretMode`: `native`, `smooth`

## Usage

```jsx
import { Field, FieldDescription, EmailInput, FieldLabel } from '@gaudi/design-system';

<Field>
  <FieldLabel htmlFor='email'>Email</FieldLabel>
  <EmailInput id='email' />
  <FieldDescription>Used for article updates only.</FieldDescription>
</Field>
```

## Accessibility

Field keeps label, input, description, and error markup colocated so form controls can be wired with id/htmlFor.

## States and recovery

- Keep the entered value when validation fails and move the actionable message next to the input.
- State the problem and the correction in plain language, then clear `aria-invalid` as soon as the value becomes valid.

## Examples

- Playground (Storybook `core-field--playground`)

Curated patterns:

- Controls in fields — registry item `@gaudi/field-controls` (uses `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `InputGroupText`, `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`, `NativeSelect`, `NativeSelectOption`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Slider`, `Textarea`)
- Validation errors — registry item `@gaudi/field-errors` (uses `Button`, `EmailInput`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `RegistryIcon`)
- Fieldsets of choices — registry item `@gaudi/field-fieldsets` (uses `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSeparator`, `FieldSet`, `FieldTitle`, `RadioGroupItem`, `RadioGroupRoot`, `SwitchRoot`)
- Fields that reflow by width — registry item `@gaudi/field-responsive` (uses `Button`, `EmailInput`, `FieldDescriptionPrimitive`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSeparator`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`)
- Preferences form that checks itself — registry item `@gaudi/field-settings-validation` (uses `Button`, `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSeparator`, `FieldTitle`, `Link`, `SwitchRoot`, `Textarea`)
- Label accessories — registry item `@gaudi/label-accessories` (uses `Badge`, `CheckboxRoot`, `EmailInput`, `FieldDescriptionPrimitive`, `FieldInput`, `FieldRoot`, `Label`, `RegistryIcon`, `Textarea`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Inline edit — registry item `@gaudi/label-inline-edit` (uses `Button`, `FieldDescriptionPrimitive`, `FieldInput`, `FieldRoot`, `Label`, `RegistryIcon`)

## Related

`core-input`

## README

Wraps a form control with its label, help text and error, and connects them for assistive technology. Use it around every Input, Textarea or `FieldInput`.

### Usage

```jsx
import { EmailInput } from '@gaudi/design-system/core/Input';
import { Field, FieldDescription, FieldError, FieldLabel } from '@gaudi/design-system';

<Field>
  <FieldLabel>Email</FieldLabel>
  <EmailInput name='email' />
  <FieldDescription>Used for article updates only.</FieldDescription>
  {error ? <FieldError>{error}</FieldError> : null}
</Field>;
```

A `FieldError` marks the control invalid and adds itself to its description. For fieldsets, horizontal rows and choice cards, use the layout parts: `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`, `FieldTitle`, `FieldSeparator` and `Label`.

### Accessibility

The label targets the control, and the description and error are read with it through `aria-describedby`. Errors are announced as alerts.

`FieldInput` inherits `caretMode` from `InputConfigProvider` and supports a local `native` or `smooth` override. See [Input caret mode](../Input/README.md#smooth-caret-mode) for behavior and native fallbacks.

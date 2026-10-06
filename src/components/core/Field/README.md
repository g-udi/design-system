# Field

Wraps a form control with its label, help text and error, and connects them for assistive technology. Use it around every Input, Textarea or `FieldInput`.

## Usage

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

## Accessibility

The label targets the control, and the description and error are read with it through `aria-describedby`. Errors are announced as alerts.

`FieldInput` inherits `caretMode` from `InputConfigProvider` and supports a local `native` or `smooth` override. See [Input caret mode](../Input/README.md#smooth-caret-mode) for behavior and native fallbacks.

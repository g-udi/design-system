# Checkbox

A box people tick to turn one option on or off, or to pick several options from a list. Use a Switch instead when the change applies straight away.

## Usage

```jsx
import { Checkbox } from '@gaudi/design-system';

<Checkbox label='Email me when someone replies' defaultChecked onCheckedChange={setReplies} />;
```

`Checkbox` pairs the box with a clickable label. For descriptions, cards, nested groups or the indeterminate state, compose `CheckboxRoot` with the Field parts (`Field`, `FieldLabel`, `FieldContent`, `FieldDescription`).

## Accessibility

The box is a `checkbox` with `aria-checked` (`mixed` when indeterminate), toggled by Space or a click on its label. A disabled checkbox dims its label too.

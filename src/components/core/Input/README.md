# Input

A single-line text field for names, emails, URLs, numbers and dates. `prefix` and `suffix` add text or icons inside the border (they render as InputGroup addons); every native attribute and the ref reach the input itself. Wrap it in a Field for its label, help and error.

For buttons, menus or several addons inside the border, compose `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText` and `InputGroupInput` directly.

## Usage

```jsx
import Input from '@gaudi/design-system/core/Input';

<Field>
  <FieldLabel>Email address</FieldLabel>
  <Input
    name='email'
    type='email'
    autoComplete='email'
    placeholder='you@example.com'
  />
  <FieldDescription>Used for your reading digest.</FieldDescription>
</Field>;
```

## Accessibility

Visible labels are connected through Field. Inputs retain native validation, autocomplete and form submission.

## Examples

The Playground shows icon and text adornments with the invalid and disabled states; the catalogue adds native types, password strength and every addon placement.

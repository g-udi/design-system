# Input

Text, search, numeric and date fields with prefix/suffix slots. Native attributes and refs reach the control; compose Field for labels, help and errors.

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

Email, Adornments, InvalidAndDisabled, DateAndTime in Storybook. All examples support light and dark themes.

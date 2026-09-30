# RadioGroup

A set of options where people pick exactly one, such as a plan or a delivery speed. Use a Select when there are more than about seven options.

## Usage

```jsx
import { RadioGroup } from '@gaudi/design-system';

<RadioGroup
  label='Reading digest'
  name='digest'
  defaultValue='weekly'
  variant='cards'
  options={[
    { value: 'weekly', label: 'Weekly', description: 'A concise update every Friday.' },
    { value: 'monthly', label: 'Monthly', description: 'The highlights, once a month.' },
    { value: 'off', label: 'Off', disabled: true }
  ]}
/>;
```

`variant='list'` shows compact rows; `cards` makes each option a bordered card. For custom layouts, compose `RadioGroupRoot` and `RadioGroupItem` with the Field parts.

## Accessibility

A fieldset and legend name the group. Arrow keys move the selection and skip disabled options, and `name` and `required` take part in native form submission.

# RadioGroup

Native single-choice groups with list and card layouts. Options accept value, label, description and disabled. Supports controlled value or defaultValue.

## Usage

```jsx
import RadioGroup from '@gaudi/design-system/core/RadioGroup';

<RadioGroup
  label='Reading digest'
  name='digest'
  defaultValue='weekly'
  options={[
    {
      value: 'weekly',
      label: 'Weekly',
      description: 'A concise update every Friday.'
    },
    {
      value: 'monthly',
      label: 'Monthly',
      description: 'The highlights, once a month.'
    },
    { value: 'off', label: 'Off' }
  ]}
/>;
```

## Accessibility

Fieldset and legend name the group. Native radio navigation, disabled behavior, required validation and form submission are retained.

## Examples

DeliveryFrequency, ChoiceCards, Disabled in Storybook. All examples support light and dark themes.

# Stepper

Sequential progress with stable step IDs, labels and optional descriptions. activeStep is zero-based; set it to steps.length for completion. Use Wizard for guarded navigation.

## Usage

```jsx
import Stepper from '@gaudi/design-system/core/Stepper';

<Stepper
  activeStep={1}
  steps={[
    { id: 'details', label: 'Details', description: 'Name and summary' },
    { id: 'audience', label: 'Audience', description: 'Who can read this?' },
    { id: 'review', label: 'Review', description: 'Confirm and publish' }
  ]}
/>;
```

## Accessibility

The active item uses aria-current=step and completed items include a text alternative. This component does not create fake tab semantics.

## Examples

InProgress, Completed, LongLabels in Storybook. All examples support light and dark themes.

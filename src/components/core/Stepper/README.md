# Stepper

Shows progress through an ordered set of steps. Use the `Stepper` default export to display where a reader is in a flow; use `Wizard` when the steps also need validation and Back/Next navigation.

```jsx
import Stepper from '@gaudi/design-system/core/Stepper';

<Stepper
  activeStep={1}
  label='Publishing progress'
  steps={[
    { id: 'details', label: 'Details', description: 'Title and cover' },
    { id: 'audience', label: 'Audience', description: 'Readers and tags' },
    { id: 'review', label: 'Review', description: 'Two editors' }
  ]}
/>
```

`activeStep` is zero-based; set it to `steps.length` when every step is done. The current step has `aria-current="step"` and completed steps show a check with a "Completed" text alternative. `label` names the group.

The display stepper is built on the composition parts (`StepperRoot`, `StepperNav`, `StepperItem`, `StepperTrigger`, `StepperIndicator`, `StepperSeparator`, `StepperTitle`, `StepperDescription`, `StepperPanel`, `StepperContent`). Compose them for clickable, controlled, loading or vertical steppers.

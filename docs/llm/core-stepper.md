# Stepper

> Core/Stepper · core · `@gaudi/design-system/core/Stepper`

Show progress through a sequence of labelled steps.

## Import

```js
import Stepper from '@gaudi/design-system/core/Stepper';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `StepperContent`, `StepperDescription`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperSeparator`, `StepperTitle`, `StepperTrigger`, `default`, `useStepItem`, `useStepper`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `steps` | `Array<{ id, label, description? }>` | `[]` | no | Ordered steps with stable identities. |
| `activeStep` | `number` | `0` | no | Zero-based index of the current step. |
| `label` | `string` | `Progress` | no | Accessible name of the sequence. |
| `orientation` | `horizontal \| vertical` | `horizontal` | no | Row of steps, or a stacked list for a sidebar. |
| `onStepSelect` | `(index: number) => void` | — | no | Turns completed steps into buttons that go back to them. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `orientation`: `horizontal`, `vertical`

## Usage

```jsx
import Stepper from '@gaudi/design-system/core/Stepper';

<Stepper steps={steps} activeStep={currentStep} />
```

## Accessibility

The active item exposes aria-current="step" and completed items have readable status. Selectable completed steps are buttons named by their label.

## Notes

- The convenience Stepper displays progress. Use Wizard for validation and navigation; the compound Stepper exports support custom interactive flows.

## Examples

- Playground (Storybook `core-stepper--playground`)
- Keyboard navigation (Storybook `core-stepper--keyboard-navigation`)

Curated patterns:

- Simple linear steps — registry item `@gaudi/stepper-basic` (uses `StepperContent`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperSeparator`, `StepperTrigger`)
- Titles and descriptions — registry item `@gaudi/stepper-descriptions` (uses `Label`, `Loader`, `RegistryIcon`, `StepperContent`, `StepperDescription`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperSeparator`, `StepperTitle`, `StepperTrigger`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)
- Controlled with icons and badges — registry item `@gaudi/stepper-icons-badges` (uses `Badge`, `Button`, `Loader`, `RegistryIcon`, `StepperContent`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperSeparator`, `StepperTitle`, `StepperTrigger`)
- Loading state — registry item `@gaudi/stepper-loading` (uses `Loader`, `RegistryIcon`, `StepperContent`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperSeparator`, `StepperTrigger`)
- Progress bar — registry item `@gaudi/stepper-progress-bar` (uses `Button`, `Label`, `RegistryIcon`, `StepperContent`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperTitle`, `StepperTrigger`, `SwitchRoot`, `cn`)
- Vertical orientation — registry item `@gaudi/stepper-vertical` (uses `Label`, `Loader`, `RegistryIcon`, `StepperContent`, `StepperDescription`, `StepperIndicator`, `StepperItem`, `StepperNav`, `StepperPanel`, `StepperRoot`, `StepperSeparator`, `StepperTitle`, `StepperTrigger`, `SwitchRoot`)

## Related

`blocks-wizard`

## README

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

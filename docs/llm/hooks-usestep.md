# useStep

> Hooks/State/useStep · hooks · `@gaudi/design-system/hooks`

The current step with next, previous, goTo and reset, clamped to the step count, controlled or uncontrolled. Pairs with Stepper and Progress.

## Import

```js
import { useStep } from '@gaudi/design-system/hooks';
```

Exports: `clampStep`, `useStep`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.count` | `number` | — | no | Number of steps. |
| `options.step / defaultStep` | `number` | `— / 0` | no | Controlled or initial step. |
| `options.onStepChange` | `(step) => void` | — | no | Called with each change. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `step / count` | `number` | The current step and the total. |
| `isFirst / isLast / canGoPrevious / canGoNext` | `boolean` | For button state. |
| `next / previous / goTo(step) / reset` | `function` | Move between steps; goTo clamps. |

## Usage

```jsx
import { useStep } from '@gaudi/design-system/hooks';

const { step, next, previous, canGoNext, canGoPrevious } = useStep({ count: 4 });
```

## Accessibility

Move focus to the new step heading after Next or Back, and state the position in text ("Step 2 of 4").

## Notes

- Validate the current step before calling next; the hook does not know your rules.

## Examples

- Wizard with progress (Storybook `hooks-state-usestep--wizard`)

## Related

`core-stepper`, `core-progress`

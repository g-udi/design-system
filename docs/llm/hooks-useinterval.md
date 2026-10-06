# useInterval

> Hooks/State/useInterval · hooks · `@gaudi/design-system/hooks`

Calls the callback every delay ms. Pass null to pause; the callback can read fresh state without restarting the interval.

## Import

```js
import { useInterval } from '@gaudi/design-system/hooks';
```

Exports: `useInterval`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `callback` | `() => void` | — | no | Called on each tick. |
| `delay` | `number \| null` | — | no | Milliseconds between ticks; null or false pauses. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `(nothing)` | `void` | The interval stops on unmount. |

## Usage

```jsx
import { useInterval } from '@gaudi/design-system/hooks';

useInterval(() => setSeconds((s) => s + 1), running ? 1000 : null);
```

## Accessibility

Content that moves or updates automatically for more than five seconds needs a pause control (WCAG 2.2.2); pass null while paused.

## Notes

- Pause in hidden tabs with usePageVisibility.

## Examples

- A pausable timer (Storybook `hooks-state-useinterval--timer`)

## Related

`hooks-usepagevisibility`

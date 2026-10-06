# useCountdown

> Hooks/State/useCountdown · hooks · `@gaudi/design-system/hooks`

Composes useInterval with count state. Changing the interval restarts the timer interval; reset stops it and restores the current countStart. Counts represent ticks, not elapsed wall-clock time.

## Import

```js
import { useCountdown } from '@gaudi/design-system/hooks';
```

Exports: `useCountdown`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.countStart / countStop` | `number / number` | `60 / 0` | no | Starting value and terminal value. |
| `options.intervalMs` | `number` | `1000` | no | Positive milliseconds per tick; invalid values stop the timer. |
| `options.isIncrement` | `boolean` | `false` | no | Count up toward the target instead of down. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `count / isRunning` | `number / boolean` | Current count and whether the timer is advancing. |
| `start / stop / reset` | `function` | Start or resume, pause, or stop and reset. |

## Usage

```jsx
import { useCountdown } from '@gaudi/design-system/hooks';

const { count, isRunning, start, stop, reset } = useCountdown({ countStart: 30 });
```

## Accessibility

Keep pause and reset controls available. Avoid announcing every tick; announce completion separately.

## Notes

- Timers can be throttled in background tabs. Use an application deadline for time-critical expiry.
- Starting at or beyond the target does not run.

## Examples

- Playground (Storybook `hooks-state-usecountdown--playground`)

## Related

`hooks-useinterval`

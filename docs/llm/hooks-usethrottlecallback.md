# useThrottleCallback

> Hooks/State/useThrottleCallback · hooks · `@gaudi/design-system/hooks`

Keeps scroll, pointer and resize handlers responsive without running on every event: the first call runs at once and later calls fold into one trailing call with the latest arguments.

## Import

```js
import { useThrottleCallback } from '@gaudi/design-system/hooks';
```

Exports: `createThrottler`, `useThrottleCallback`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `callback` | `(...args) => void` | — | no | The work to run. |
| `wait` | `number` | `200` | no | Minimum milliseconds between runs. |
| `options.leading / trailing` | `boolean` | `true / true` | no | Run on the first call, and once more after the window. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `throttled(...args)` | `function` | Call as often as you like. |
| `throttled.cancel / flush` | `function` | Drop or run the pending trailing call. |

## Usage

```jsx
import { useThrottleCallback } from '@gaudi/design-system/hooks';

const onScroll = useThrottleCallback(() => setProgress(readProgress()), 100);
```

## Accessibility

Keep the final state accurate (trailing: true) so progress indicators and announcements end on the real value.

## Notes

- `createThrottler(callback, wait, options)` is exported for non-React code.

## Examples

- Throttle pointer moves (Storybook `hooks-state-usethrottlecallback--pointer-moves`)

# useEventCallback

> Hooks/State/useEventCallback · hooks · `@gaudi/design-system/hooks`

Pass handlers to effects, subscriptions and memoised children without re-running them when an inline callback changes. Call it from events and effects, not during render.

## Import

```js
import { useEventCallback } from '@gaudi/design-system/hooks';
```

Exports: `useEventCallback`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `callback` | `(...args) => any` | — | no | The latest implementation. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `stableCallback` | `(...args) => any` | Same identity for the component lifetime. |

## Usage

```jsx
import { useEventCallback } from '@gaudi/design-system/hooks';

const onMessage = useEventCallback((message) => setLog((log) => [...log, message]));
useEffect(() => socket.subscribe(onMessage), [onMessage]);
```

## Accessibility

No direct accessibility impact; it keeps listeners stable so focus and announcements are not reset by re-subscriptions.

## Notes

- Do not call the returned function during render.

## Examples

- Fresh state, stable subscription (Storybook `hooks-state-useeventcallback--stable-subscription`)

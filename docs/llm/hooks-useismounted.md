# useIsMounted

> Hooks/Environment/useIsMounted · hooks · `@gaudi/design-system/hooks`

Returns a getter that is false during server rendering and before its mount effect, true while mounted and false after cleanup. Checking it does not cause a render.

## Import

```js
import { useIsMounted } from '@gaudi/design-system/hooks';
```

Exports: `useIsMounted`

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `isMounted()` | `() => boolean` | Read the mount state when an asynchronous callback completes. |

## Usage

```jsx
import { useIsMounted } from '@gaudi/design-system/hooks';

const isMounted = useIsMounted();
```

## Accessibility

Keep pending, success and cancellation feedback visible to users.

## Notes

- This does not cancel work or protect against stale responses after props change. Prefer AbortController or request identity for those cases.
- Use useIsClient for a reactive hydration flag. React Strict Mode replays effects in development.

## Examples

- Playground (Storybook `hooks-environment-useismounted--playground`)

## Related

`hooks-useisclient`

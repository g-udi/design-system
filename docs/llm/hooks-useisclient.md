# useIsClient

> Hooks/Environment/useIsClient · hooks · `@gaudi/design-system/hooks`

Defers browser-only output (theme toggles, local times, storage-backed values) without a hydration mismatch, and without the extra render of a mounted flag set in an effect.

## Import

```js
import { useIsClient } from '@gaudi/design-system/hooks';
```

Exports: `useIsClient`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `(none)` | `—` | — | no | Takes no arguments. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `isClient` | `boolean` | True once rendering on the client. |

## Usage

```jsx
import { useIsClient } from '@gaudi/design-system/hooks';

const isClient = useIsClient();
return <time>{isClient ? date.toLocaleTimeString() : '—'}</time>;
```

## Accessibility

Render a same-size placeholder on the server so the layout does not jump and focus order does not change when the client value appears.

## Notes

- The ThemeSwitch uses it for its mounted state.

## Examples

- Browser-only output (Storybook `hooks-environment-useisclient--localised-time`)

# useUnmount

> Hooks/State/useUnmount · hooks · `@gaudi/design-system/hooks`

Keeps a fresh callback without recreating the subscription. Runs during unmount and React Strict Mode effect probes; callbacks must tolerate repeated setup/cleanup.

## Import

```js
import { useUnmount } from '@gaudi/design-system/hooks';
```

Exports: `useUnmount`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `callback` | `() => void` | — | no | Latest committed cleanup callback. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `return` | `undefined` | No state or actions. |

## Usage

```jsx
import { useUnmount } from '@gaudi/design-system/hooks';

useUnmount(() => releasePreview());
```

## Accessibility

Do not announce routine cleanup or steal focus. Restore focus through the owning overlay component.

## Notes

- For resource acquisition, prefer a normal effect that returns the cleanup for that exact resource.

## Examples

- Playground (Storybook `hooks-state-useunmount--playground`)

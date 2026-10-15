# useLocalStorage

> Hooks/Data/useLocalStorage · hooks · `@gaudi/design-system/hooks`

Stores a JSON value under a key. The server render and hydration use the initial value, and the stored value is read right after. Every caller with the same key stays in sync in this tab and in other tabs; blocked storage falls back to memory.

## Import

```js
import { useLocalStorage } from '@gaudi/design-system/hooks';
```

Exports: `useLocalStorage`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `key` | `string` | — | no | Storage key; namespace it, for example reader:font-size. |
| `initialValue` | `any` | — | no | Value on the server, during hydration and when nothing is stored. |
| `options.serialize` | `(value) => string` | — | no | Custom encoding. |
| `deserialize` | `(raw) => any` | — | no | Custom encoding. |
| `options.syncTabs` | `boolean` | `true` | no | Follow writes from other tabs. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `[0] value` | `any` | Current value. |
| `[1] setValue` | `(value \| (current) => value) => void` | Store a new value. |
| `[2] removeValue` | `() => void` | Delete the key and fall back to initialValue. |

## Usage

```jsx
import { useLocalStorage } from '@gaudi/design-system/hooks';

const [fontSize, setFontSize, resetFontSize] = useLocalStorage('reader:font-size', 'md');
```

## Accessibility

Persisted preferences (text size, reduced motion, dismissed notices) must still have a visible control to change them back.

## Notes

- Never store secrets, tokens or personal data in localStorage.

## Examples

- Reading preference (Storybook `hooks-data-uselocalstorage--preference`)
- Callers stay in sync (Storybook `hooks-data-uselocalstorage--synced`)
- Preferences follow the active key (Storybook `hooks-data-uselocalstorage--per-project`)

# useSessionStorage

> Hooks/Data/useSessionStorage · hooks · `@gaudi/design-system/hooks`

The same API as useLocalStorage over sessionStorage: survives a reload, not a new tab. Good for wizard progress and half-filled forms.

## Import

```js
import { useSessionStorage } from '@gaudi/design-system/hooks';
```

Exports: `sessionStorageStore`, `useSessionStorage`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `key` | `string` | — | no | Storage key. |
| `initialValue` | `any` | — | no | Value on the server, during hydration and when nothing is stored. |
| `options.serialize` | `(value) => string` | — | no | Custom encoding. |
| `deserialize` | `(raw) => any` | — | no | Custom encoding. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `[0] value` | `any` | Current value. |
| `[1] setValue` | `(value \| (current) => value) => void` | Store a new value. |
| `[2] removeValue` | `() => void` | Delete the key and fall back to initialValue. |

## Usage

```jsx
import { useSessionStorage } from '@gaudi/design-system/hooks';

const [draft, setDraft, clearDraft] = useSessionStorage('contact:draft', { name: '', message: '' });
```

## Accessibility

Restoring a form after a reload helps people who navigate slowly or lose their place; tell them the draft was restored and let them clear it.

## Notes

- Session storage is per tab, so there is no cross-tab sync.

## Examples

- Keep a form draft (Storybook `hooks-data-usesessionstorage--form-draft`)

## Related

`hooks-uselocalstorage`

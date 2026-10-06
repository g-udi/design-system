# useReadLocalStorage

> Hooks/Data/useReadLocalStorage · hooks · `@gaudi/design-system/hooks`

Reads through the same store as useLocalStorage, including same-tab notifications, native cross-tab storage events and blocked-storage fallback. It never exposes write actions.

## Import

```js
import { useReadLocalStorage } from '@gaudi/design-system/hooks';
```

Exports: `useReadLocalStorage`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `key` | `string` | — | no | Storage key to subscribe to. |
| `initialValue` | `any` | `null` | no | Server, hydration, absent-key and invalid-JSON fallback. |
| `options.deserialize / syncTabs` | `function / boolean` | `JSON.parse / true` | no | Custom reader and whether to subscribe to cross-tab changes. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `value` | `any` | Current parsed value or initialValue. |

## Usage

```jsx
import { useReadLocalStorage } from '@gaudi/design-system/hooks';

const density = useReadLocalStorage('reading-density', 'comfortable');
```

## Accessibility

Announce meaningful changes in context. Do not put sensitive data in browser storage.

## Notes

- Same-tab changes made with useLocalStorage notify readers. Direct localStorage.setItem calls in the same tab do not dispatch a storage event.

## Examples

- Playground (Storybook `hooks-data-usereadlocalstorage--playground`)

## Related

`hooks-uselocalstorage`

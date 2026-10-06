# useControllableState

> Hooks/State/useControllableState · hooks · `@gaudi/design-system/hooks`

The component owns the state until its host passes value; then the host accepts, refuses or replaces each change offered through onChange. The setter takes a value or an updater and skips unchanged values. DataTable uses it.

## Import

```js
import { useControllableState } from '@gaudi/design-system/hooks';
```

Exports: `useControllableState`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.value` | `any` | — | no | Controlled value; undefined means uncontrolled. |
| `options.defaultValue` | `any` | — | no | Initial value when uncontrolled. |
| `options.onChange` | `(value) => void` | — | no | Called with each change. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `[0] value` | `any` | The current value. |
| `[1] setValue` | `(value \| (current) => value) => void` | Offer a change. |

## Usage

```jsx
import { useControllableState } from '@gaudi/design-system/hooks';

function Rating({ value, defaultValue = 0, onChange }) {
  const [rating, setRating] = useControllableState({ value, defaultValue, onChange });
}
```

## Accessibility

Controlled components must still reflect every change visibly and to assistive technology (checked, expanded, selected), even when the host refuses it.

## Notes

- Decide once: switching between controlled and uncontrolled during a component life is not supported.

## Examples

- Uncontrolled (Storybook `hooks-state-usecontrollablestate--uncontrolled`)
- Controlled, with the host refusing changes (Storybook `hooks-state-usecontrollablestate--controlled`)

## Related

`core-datatable`

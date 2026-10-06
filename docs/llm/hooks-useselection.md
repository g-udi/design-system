# useSelection

> Hooks/Data/useSelection · hooks · `@gaudi/design-system/hooks`

Tracks selected ids for lists, tables and bulk actions. Uncontrolled from initialSelectedIds, or controlled with selectedIds and onSelectionChange; every change produces a new Set.

## Import

```js
import { useSelection } from '@gaudi/design-system/hooks';
```

Exports: `selectionState`, `toggleInSet`, `useSelection`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.selectedIds` | `Set<id>` | — | no | Controlled selection. |
| `options.initialSelectedIds` | `Set<id>` | `new Set()` | no | Initial selection when uncontrolled. |
| `options.onSelectionChange` | `(ids: Set<id>) => void` | — | no | Called with the next selection. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `selectedIds / count` | `Set<id> / number` | The selection and its size. |
| `isSelected(id)` | `boolean` | Whether an id is selected. |
| `getSelectAllState(ids)` | `true \| false \| 'indeterminate'` | State for a select-all checkbox. |
| `toggleSelection / select / deselect` | `(id) => void` | Change one id. |
| `selectAll / toggleAll / clearSelection / setSelection` | `function` | Change many ids at once. |

## Usage

```jsx
import { useSelection } from '@gaudi/design-system/hooks';

const { isSelected, toggleSelection, getSelectAllState, toggleAll, count } = useSelection();
```

## Accessibility

Give every checkbox a label naming its row, give the select-all checkbox an indeterminate state, and announce bulk results (for example with useLiveAnnouncer).

## Notes

- DataTable has its own selection; use this hook for custom lists, galleries and cards.

## Examples

- Bulk actions with select all (Storybook `hooks-data-useselection--bulk-actions`)
- Controlled with a limit (Storybook `hooks-data-useselection--controlled`)

## Related

`core-datatable`, `hooks-useliveannouncer`

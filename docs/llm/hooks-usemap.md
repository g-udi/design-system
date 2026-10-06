# useMap

> Hooks/Data/useMap · hooks · `@gaudi/design-system/hooks`

Accepts a Map or iterable of key-value pairs. Each mutation creates a new Map, preserving caller-owned input. The initial entries are snapshotted once, including single-use iterators; reset copies that snapshot.

## Import

```js
import { useMap } from '@gaudi/design-system/hooks';
```

Exports: `useMap`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `initialEntries` | `Map \| Iterable<[key, value]>` | `[]` | no | Initial contents, snapshotted at mount for reset. Later changes to this argument are ignored; use setAll to replace state. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `[map, actions]` | `[Map, object]` | Read-only-by-convention Map and stable actions. |
| `actions.set / remove / setAll / clear / reset` | `function` | Set one key, remove a key, replace all entries, empty the Map or restore the initial entries. |

## Usage

```jsx
import { useMap } from '@gaudi/design-system/hooks';

const [drafts, { set, remove, reset }] = useMap([['intro', 'Draft']]);
```

## Accessibility

Render stable keys and keep focus meaningful when entries are removed.

## Notes

- Do not call map.set/delete/clear directly; those mutations cannot notify React.

## Examples

- Playground (Storybook `hooks-data-usemap--playground`)

## Related

`core-map`

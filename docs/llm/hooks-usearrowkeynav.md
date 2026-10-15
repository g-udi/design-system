# useArrowKeyNav

> Hooks/A11y/useArrowKeyNav · hooks · `@gaudi/design-system/hooks`

Moves focus between items with the arrow keys, Home and End while the group stays one Tab stop. The active item has tabIndex 0 and the rest -1. Keys typed in text fields and keys with Command, Control or Alt are left alone.

## Import

```js
import { useArrowKeyNav } from '@gaudi/design-system/hooks';
```

Exports: `useArrowKeyNav`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `itemCount` | `number` | — | no | Number of navigable items; the active index is clamped when items are removed. |
| `options.orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | no | Which arrow keys move: Up and Down, Left and Right, or all four. |
| `options.wrap` | `boolean` | `false` | no | Loop from the last item to the first and back. |
| `options.dir` | `'ltr' \| 'rtl'` | `'ltr'` | no | In right-to-left layouts ArrowLeft moves forward. |
| `options.role` | `string` | `'group'` | no | Container role; aria-orientation is added for roles that support it (toolbar, listbox, menu, tablist…). |
| `options.defaultIndex` | `number` | `0` | no | Initial active item, and a callback when it changes. |
| `onActiveChange` | `(index) => void` | — | no | Initial active item, and a callback when it changes. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `activeIndex` | `number` | The item that holds tabIndex 0. |
| `getItemProps(index)` | `{ tabIndex, onKeyDown, onFocus, ref }` | Spread on each item. |
| `containerProps` | `{ role, aria-orientation? }` | Spread on the container, then give it an accessible name. |
| `setActiveIndex(index, { focus })` | `function` | Move the active item from code; focuses it unless focus is false. |

## Usage

```jsx
import { useArrowKeyNav } from '@gaudi/design-system/hooks';

const { getItemProps, containerProps } = useArrowKeyNav(tools.length, { orientation: 'horizontal', role: 'toolbar', wrap: true });

<div {...containerProps} aria-label='Formatting'>
  {tools.map((tool, index) => <Button key={tool} {...getItemProps(index)}>{tool}</Button>)}
</div>
```

## Accessibility

Implements the WAI-ARIA roving tabindex pattern: one Tab stop for the group, arrows inside it. Name the container (aria-label or aria-labelledby) and give it the role the widget really is, such as toolbar.

## Notes

- Gaudi Tabs, ToggleGroup, RadioGroup and menus already handle their own arrow keys.
- `getNextIndex(current, key, options)` is exported for custom key handling.

## Examples

- Toolbar (Storybook `hooks-a11y-usearrowkeynav--toolbar`)
- Vertical section list (Storybook `hooks-a11y-usearrowkeynav--vertical-list`)

## Related

`core-tabs`, `core-togglegroup`, `core-radiogroup`

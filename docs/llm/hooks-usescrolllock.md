# useScrollLock

> Hooks/Interaction/useScrollLock · hooks · `@gaudi/design-system/hooks`

Sets overflow hidden on the body while locked and pads it by the scrollbar width so content does not shift. Locks from several components nest; the last release restores the page.

## Import

```js
import { useScrollLock } from '@gaudi/design-system/hooks';
```

Exports: `useScrollLock`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `locked` | `boolean` | `true` | no | Whether scrolling is locked. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `(nothing)` | `void` | The lock is released on unlock or unmount. |

## Usage

```jsx
import { useFocusTrap, useScrollLock } from '@gaudi/design-system/hooks';

useScrollLock(open);
const trapRef = useFocusTrap({ active: open });
```

## Accessibility

Lock scrolling together with a focus trap, so neither the pointer nor the keyboard reaches the page behind the overlay.

## Notes

- Dialog, Sheet and Drawer lock scrolling themselves.
- `lockScroll()` returns a release function for non-React code.

## Examples

- Full-screen menu (Storybook `hooks-interaction-usescrolllock--overlay-menu`)

## Related

`core-dialog`, `core-sheet`

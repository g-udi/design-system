# useFocusTrap

> Hooks/A11y/useFocusTrap · hooks · `@gaudi/design-system/hooks`

While active, Tab and Shift+Tab wrap inside the container. On activation it focuses the first tabbable element (or the container), and on release it returns focus to where it was. Traps nest, and portaled menus inside the trap keep their own focus.

## Import

```js
import { useFocusTrap } from '@gaudi/design-system/hooks';
```

Exports: `useFocusTrap`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.active` | `boolean` | `true` | no | Whether the trap is on. |
| `options.autoFocus` | `boolean` | `true` | no | Move focus into the container when it activates. |
| `options.initialFocus` | `'first' \| 'container'` | `'first'` | no | Focus the first tabbable element or the container itself (give it tabIndex={-1}). |
| `options.returnFocus` | `boolean` | `true` | no | Return focus to the previously focused element on release. |
| `options.containerRef` | `RefObject<HTMLElement>` | — | no | Use an existing ref instead of the returned one. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `RefObject<HTMLElement>` | Attach to the container. |

## Usage

```jsx
import { useFocusTrap } from '@gaudi/design-system/hooks';

const trapRef = useFocusTrap({ active: open });

<div ref={trapRef} role='dialog' aria-modal='true' aria-labelledby='menu-title'>…</div>
```

## Accessibility

A trap must always have a visible, keyboard-reachable way out (a Close button and Escape). Pair it with role="dialog", aria-modal and a label, and with useScrollLock so the page behind does not scroll.

## Notes

- Gaudi Dialog, Dialog confirmation, Sheet and Drawer already trap focus; use this hook only for custom overlays.

## Examples

- Custom reply panel (Storybook `hooks-a11y-usefocustrap--inline-panel`)
- Focus the container first (Storybook `hooks-a11y-usefocustrap--container-focus`)

## Related

`core-dialog`, `core-sheet`, `hooks-usescrolllock`

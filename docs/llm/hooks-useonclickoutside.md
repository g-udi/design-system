# useOnClickOutside

> Hooks/Interaction/useOnClickOutside · hooks · `@gaudi/design-system/hooks`

Listens for pointerdown on the document and calls the handler when the target is outside every ref, for custom panels and inline editors. Pass several refs, such as a trigger and its panel.

## Import

```js
import { useOnClickOutside } from '@gaudi/design-system/hooks';
```

Exports: `useOnClickOutside`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ref` | `RefObject \| RefObject[]` | — | no | Element or elements that count as inside. |
| `handler` | `(event) => void` | — | no | Called on an outside press. |
| `options` | `string \| { event?, enabled? }` | `{ event: 'pointerdown', enabled: true }` | no | Event name ('pointerdown', 'mousedown', 'click', 'focusin'…) or options. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `(nothing)` | `void` | The listener lives as long as the component. |

## Usage

```jsx
import { useOnClickOutside } from '@gaudi/design-system/hooks';

useOnClickOutside([triggerRef, panelRef], () => setOpen(false), { enabled: open });
```

## Accessibility

An outside click is a pointer shortcut. Also close on Escape and return focus to the trigger, so keyboard users can dismiss the panel.

## Notes

- Popover, Dialog, Select and menus already dismiss themselves.

## Examples

- Commit an inline editor (Storybook `hooks-interaction-useonclickoutside--inline-editor`)
- Trigger and panel together (Storybook `hooks-interaction-useonclickoutside--trigger-and-panel`)

## Related

`core-popover`, `core-dialog`, `core-select`

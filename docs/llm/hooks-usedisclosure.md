# useDisclosure

> Hooks/State/useDisclosure · hooks · `@gaudi/design-system/hooks`

Open state for dialogs, menus, drawers and custom disclosures, controlled or uncontrolled, with getTriggerProps for a custom trigger.

## Import

```js
import { useDisclosure } from '@gaudi/design-system/hooks';
```

Exports: `useDisclosure`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.open / defaultOpen` | `boolean` | `— / false` | no | Controlled or initial state. |
| `options.onOpenChange` | `(open) => void` | — | no | Called with each change. |
| `options.id` | `string` | — | no | Id of the controlled region, added as aria-controls by getTriggerProps. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether it is open. |
| `onOpen / onClose / onToggle / setOpen` | `function` | Change the state. |
| `getTriggerProps(props)` | `{ aria-expanded, aria-controls?, onClick }` | Spread on a custom trigger button. |

## Usage

```jsx
import { useDisclosure } from '@gaudi/design-system/hooks';

const { open, setOpen, onOpen } = useDisclosure();

<Button onClick={onOpen}>Share</Button>
<Dialog open={open} onOpenChange={setOpen} title='Share'>…</Dialog>
```

## Accessibility

A custom trigger must be a button with aria-expanded and, when the region is in the page, aria-controls; getTriggerProps adds both.

## Notes

- Gaudi overlays take open and onOpenChange directly: pass them through.

## Examples

- Drive a Gaudi Dialog (Storybook `hooks-state-usedisclosure--with-dialog`)
- Custom disclosure (Storybook `hooks-state-usedisclosure--custom-trigger`)

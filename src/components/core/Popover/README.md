# Popover

A button that opens a small, non-modal panel for supporting content: share settings, quick filters, a short form. Use a hover card for read-only previews that open on hover, and a Dialog when the task needs the user's full attention.

## Usage

```jsx
import { Popover } from '@gaudi/design-system';

<Popover trigger='Share' side='bottom' align='start'>
  <PopoverHeader>
    <PopoverTitle>Share this draft</PopoverTitle>
    <PopoverDescription>Anyone with the link can view.</PopoverDescription>
  </PopoverHeader>
</Popover>
```

## API

| Prop                                         | Type                            | Contract                                                  |
| -------------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| `trigger`                                    | ReactNode                       | Content of the outline button that opens the panel.       |
| `children`                                   | ReactNode                       | Panel content.                                            |
| `side / align`                               | top, right, bottom, left / start, center, end | Preferred placement; collisions may flip it. |
| `open / defaultOpen / onOpenChange / modal`  | boolean / boolean / function / boolean | Controlled or initial visibility.                  |
| `className / contentClassName`               | string                          | Classes for the trigger button and the panel.             |

## Composition

`@gaudi/design-system/core/Popover` exports the compound parts: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, and `HoverCard`, `HoverCardTrigger`, `HoverCardContent`. From the package root the parts are `PopoverPrimitive`, `PopoverTriggerPrimitive` and `PopoverContentPrimitive`, because `Popover` there is the convenience component.

## Accessibility

The trigger is a native button with `aria-expanded`. Escape and a click outside close the panel and return focus to the trigger. Keep the content short; move long forms into a Dialog.

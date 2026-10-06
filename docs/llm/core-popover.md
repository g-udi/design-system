# Popover

> Core/Popover · core · `@gaudi/design-system/core/Popover`

Popover renders compact positioned supporting content next to its trigger.

## Import

```js
import Popover from '@gaudi/design-system/core/Popover';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `HoverCard`, `HoverCardContent`, `HoverCardTrigger`, `Popover`, `PopoverAnchor`, `PopoverContent`, `PopoverContentPrimitive`, `PopoverDescription`, `PopoverHeader`, `PopoverPrimitive`, `PopoverRoot`, `PopoverTitle`, `PopoverTrigger`, `PopoverTriggerPrimitive`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | no | Label or content of the outline trigger button. |
| `children` | `ReactNode` | — | no | Panel content. |
| `side / align` | `top \| right \| bottom \| left / start \| center \| end` | `bottom / center` | no | Placement of the panel relative to the trigger. |
| `open / defaultOpen / onOpenChange / modal` | `boolean / boolean / function / boolean` | — | no | Controlled or initial open state, and whether outside content is inert while open. |
| `contentClassName` | `string` | — | no | Panel class override. |
| `className` | `string` | — | no | Trigger button class override. |

## Usage

```jsx
import { Popover } from '@gaudi/design-system';

<Popover trigger='Open popover'>Compact supporting content.</Popover>
```

## Accessibility

The trigger is a DS button with aria-expanded; the panel is portalled, dismisses on Escape or an outside click, and returns focus to the trigger. Keep popover content short and non-modal.

## Examples

- Playground (Storybook `core-popover--playground`)
- Controlled composition (Storybook `core-popover--composed`)

Curated patterns:

- Relative timestamp — registry item `@gaudi/hover-card-relative-time` (uses `Badge`, `Button`, `HoverCard`, `HoverCardContent`, `HoverCardTrigger`, `Separator`)
- Rich hover cards — registry item `@gaudi/hover-card-rich` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `HoverCard`, `HoverCardContent`, `HoverCardTrigger`, `RegistryIcon`)
- Sides — registry item `@gaudi/hover-card-sides` (uses `Button`, `HoverCard`, `HoverCardContent`, `HoverCardTrigger`)
- Inside a dialog — registry item `@gaudi/popover-in-dialog` (uses `Button`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `HoverCard`, `HoverCardContent`, `HoverCardTrigger`, `PopoverContentPrimitive`, `PopoverDescription`, `PopoverHeader`, `PopoverPrimitive`, `PopoverTitle`, `PopoverTriggerPrimitive`)
- Paged content — registry item `@gaudi/popover-paged` (uses `Badge`, `Button`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`)
- Sides and alignment — registry item `@gaudi/popover-placement` (uses `Button`, `PopoverContentPrimitive`, `PopoverDescription`, `PopoverHeader`, `PopoverPrimitive`, `PopoverTitle`, `PopoverTriggerPrimitive`)
- Rich content — registry item `@gaudi/popover-rich` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Link`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTitle`, `PopoverTriggerPrimitive`, `RegistryIcon`)
- Settings form — registry item `@gaudi/popover-settings-form` (uses `Button`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `PopoverContentPrimitive`, `PopoverDescription`, `PopoverHeader`, `PopoverPrimitive`, `PopoverTitle`, `PopoverTriggerPrimitive`, `RegistryIcon`, `Slider`, `SwitchRoot`)

## README

A button that opens a small, non-modal panel for supporting content: share settings, quick filters, a short form. Use a hover card for read-only previews that open on hover, and a Dialog when the task needs the user's full attention.

### Usage

```jsx
import { Popover } from '@gaudi/design-system';

<Popover trigger='Share' side='bottom' align='start'>
  <PopoverHeader>
    <PopoverTitle>Share this draft</PopoverTitle>
    <PopoverDescription>Anyone with the link can view.</PopoverDescription>
  </PopoverHeader>
</Popover>
```

### API

| Prop                                         | Type                            | Contract                                                  |
| -------------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| `trigger`                                    | ReactNode                       | Content of the outline button that opens the panel.       |
| `children`                                   | ReactNode                       | Panel content.                                            |
| `side / align`                               | top, right, bottom, left / start, center, end | Preferred placement; collisions may flip it. |
| `open / defaultOpen / onOpenChange / modal`  | boolean / boolean / function / boolean | Controlled or initial visibility.                  |
| `className / contentClassName`               | string                          | Classes for the trigger button and the panel.             |

### Composition

`@gaudi/design-system/core/Popover` exports the compound parts: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, and `HoverCard`, `HoverCardTrigger`, `HoverCardContent`. From the package root the parts are `PopoverPrimitive`, `PopoverTriggerPrimitive` and `PopoverContentPrimitive`, because `Popover` there is the convenience component.

### Accessibility

The trigger is a native button with `aria-expanded`. Escape and a click outside close the panel and return focus to the trigger. Keep the content short; move long forms into a Dialog.

# Sheet

> Core/Sheet · core · `@gaudi/design-system/core/Sheet`

A panel that slides in from an edge over a dimmed page, for side tasks such as settings, details, comments, notifications or an assistant, without leaving the current screen.

## Import

```js
import Sheet from '@gaudi/design-system/core/Sheet';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetOverlay`, `SheetPortal`, `SheetTitle`, `SheetTrigger`, `default`, `sheetOverlays`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `Sheet.open / defaultOpen / onOpenChange` | `boolean / (open) => void` | — | no | Controlled or initial open state. |
| `SheetContent.side` | `right \| left \| top \| bottom` | `right` | no | Edge the panel slides from. |
| `SheetContent.size` | `sm \| md \| lg \| xl` | `sm` | no | Width of side panels. |
| `SheetContent.inset` | `boolean` | `false` | no | Float the panel off the edge with a rounded border. |
| `SheetContent.overlay` | `dim \| blur` | `dim` | no | How the page behind is dimmed. |
| `SheetContent.showCloseButton` | `boolean` | `true` | no | Corner close button. |
| `SheetHeader / SheetTitle / SheetDescription / SheetFooter` | `parts` | — | no | Fixed header and footer around a scrolling body. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@gaudi/design-system/core/Sheet';

<Sheet>
  <SheetTrigger>Inspect details</SheetTrigger>
  <SheetContent side='right'><SheetHeader><SheetTitle>Details</SheetTitle><SheetDescription>Review the selected record.</SheetDescription></SheetHeader>{details}</SheetContent>
</Sheet>
```

## Accessibility

The sheet is a modal dialog: focus moves in and is trapped, Escape and the backdrop close it, the page behind is inert, and focus returns to the trigger. Give every sheet a SheetTitle.

## Notes

- Use Dialog for short centred decisions and Sheet for longer side tasks.

## Examples

- Playground (Storybook `core-sheet--playground`)

Curated patterns:

- Assistant — registry item `@gaudi/sheet-assistant` (uses `Button`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageContent`, `ChatPromptComposer`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `SheetTrigger`)
- Comments — registry item `@gaudi/sheet-comments` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Label`, `RegistryIcon`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `SwitchRoot`, `Textarea`)
- Sheet from each edge — registry item `@gaudi/sheet-edges` (uses `Button`, `ScrollArea`, `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`)
- Help and shortcuts — registry item `@gaudi/sheet-help-shortcuts` (uses `Button`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `Item`, `ItemContent`, `ItemDescription`, `ItemMedia`, `ItemTitle`, `KbdGroup`, `KbdRoot`, `RegistryIcon`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- New project — registry item `@gaudi/sheet-new-project` (uses `Button`, `Calendar`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `Label`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `SwitchRoot`, `Textarea`)
- Notifications — registry item `@gaudi/sheet-notifications` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `RegistryIcon`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `cn`)
- Record details — registry item `@gaudi/sheet-record-details` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `FieldInput`, `ProgressRoot`, `RegistryIcon`, `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `TimelineContent`, `TimelineDate`, `TimelineHeader`, `TimelineIndicator`, `TimelineItem`, `TimelineRoot`, `TimelineSeparator`, `TimelineTitle`)
- Settings — registry item `@gaudi/sheet-settings` (uses `Button`, `EmailInput`, `FieldDescriptionPrimitive`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `RegistryIcon`, `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`)

## Related

`core-dialog`

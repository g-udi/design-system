# DropdownMenu

> Core/DropdownMenu · core · `@gaudi/design-system/core/DropdownMenu`

Action menus with keyboard navigation, checkbox choices and destructive actions.

## Import

```js
import DropdownMenu from '@gaudi/design-system/core/DropdownMenu';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuPortal`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`, `DropdownMenuCheckboxItem`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuItemPrimitive`, `DropdownMenuLabel`, `DropdownMenuLabelPrimitive`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparator`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `Menubar`, `MenubarCheckboxItem`, `MenubarContent`, `MenubarGroup`, `MenubarItem`, `MenubarLabel`, `MenubarMenu`, `MenubarPortal`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarTrigger`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `trigger` | `ReactElement` | — | no | Ref-forwarding button that opens the menu. |
| `align` | `start \| center \| end` | `end` | no | Horizontal alignment of the popup. |
| `open / defaultOpen` | `boolean` | — | no | Controlled or initial open state. Use one state model for the lifetime of the component. |
| `onOpenChange` | `(open: boolean) => void` | — | no | Responds to open and close requests. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `DropdownMenuItem.onSelect` | `(event: Event) => void` | — | no | Action invoked by keyboard or pointer selection. |
| `DropdownMenuItem.destructive / disabled` | `boolean` | — | no | Destructive styling or unavailable action. |
| `DropdownMenuCheckboxItem.checked` | `boolean \| indeterminate` | — | no | Controlled checkbox menu item. |
| `onCheckedChange` | `function` | — | no | Controlled checkbox menu item. |

## Variants

- `align`: `start`, `center`, `end`

## Usage

```jsx
import DropdownMenu, { DropdownMenuItem } from '@gaudi/design-system/core/DropdownMenu';
import Button from '@gaudi/design-system/core/Button';

<DropdownMenu trigger={<Button variant='outline'>Document actions</Button>}>
  <DropdownMenuItem onSelect={duplicate}>Duplicate</DropdownMenuItem>
  <DropdownMenuItem onSelect={archive}>Archive</DropdownMenuItem>
</DropdownMenu>
```

## Accessibility

Arrow keys navigate items; Escape closes and returns focus. Use menu items for actions and links for navigation.

## Examples

- Playground (Storybook `core-dropdownmenu--playground`)

Curated patterns:

- Context menu inside a dialog — registry item `@gaudi/context-menu-in-dialog` (uses `Button`, `ContextMenu`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `RegistryIcon`)
- Context menu — registry item `@gaudi/context-menu-item-kinds` (uses `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`, `RegistryIcon`)
- Account and create menus — registry item `@gaudi/dropdown-menu-account-create` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `RegistryIcon`, `Separator`, `Tabs`, `TabsList`, `TabsTrigger`, `cn`)
- Item kinds — registry item `@gaudi/dropdown-menu-item-kinds` (uses `Button`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `RegistryIcon`)
- Notifications — registry item `@gaudi/dropdown-menu-notifications` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Link`, `RegistryIcon`)
- Side and alignment — registry item `@gaudi/dropdown-menu-placement` (uses `Button`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`)
- Workspace and model switchers — registry item `@gaudi/dropdown-menu-switchers` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `ClaudeAiIcon`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Gemini`, `Openai`, `OpenaiDark`, `RegistryIcon`)
- Application menubar — registry item `@gaudi/menubar-application` (uses `Menubar`, `MenubarCheckboxItem`, `MenubarContent`, `MenubarGroup`, `MenubarItem`, `MenubarLabel`, `MenubarMenu`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarTrigger`, `RegistryIcon`)

## README

Action menus with item, checkbox, label and separator primitives. Supply a single button trigger; onSelect belongs to each action. Disabled items stay discoverable and inactive.

### Usage

```jsx
<DropdownMenu trigger={<Button>Article actions</Button>}>
  <DropdownMenuItem onSelect={edit}>Edit article</DropdownMenuItem>
  <DropdownMenuItem disabled>Publish</DropdownMenuItem>
</DropdownMenu>
```

### API

| Prop / export                               | Type                   | Contract                                                    |
| ------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| `trigger / children`                        | ReactNode              | Button trigger and menu primitives.                         |
| `align`                                     | start or center or end | Popup alignment with viewport collision handling.           |
| `DropdownMenuItem.onSelect`                 | function               | Action callback. preventDefault keeps the menu open.        |
| `DropdownMenuCheckboxItem`                  | component              | checked, onCheckedChange and disabled for view preferences. |
| `DropdownMenuLabel / DropdownMenuSeparator` | components             | Non-interactive grouping content.                           |

### Composition

`DropdownMenu` is the DropdownMenu parts with the trigger and content wired together. For radio groups, submenus and shortcuts, compose `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuRadioGroup`, `DropdownMenuSub` and `DropdownMenuShortcut` directly. Right-click menus use `ContextMenu*`, and application menu bars use `Menubar*`.

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.

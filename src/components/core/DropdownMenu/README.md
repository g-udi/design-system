# DropdownMenu

Action menus with item, checkbox, label and separator primitives. Supply a single button trigger; onSelect belongs to each action. Disabled items stay discoverable and inactive.

## Usage

```jsx
<DropdownMenu trigger={<Button>Article actions</Button>}>
  <DropdownMenuItem onSelect={edit}>Edit article</DropdownMenuItem>
  <DropdownMenuItem disabled>Publish</DropdownMenuItem>
</DropdownMenu>
```

## API

| Prop / export                               | Type                   | Contract                                                    |
| ------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| `trigger / children`                        | ReactNode              | Button trigger and menu primitives.                         |
| `align`                                     | start or center or end | Popup alignment with viewport collision handling.           |
| `DropdownMenuItem.onSelect`                 | function               | Action callback. preventDefault keeps the menu open.        |
| `DropdownMenuCheckboxItem`                  | component              | checked, onCheckedChange and disabled for view preferences. |
| `DropdownMenuLabel / DropdownMenuSeparator` | components             | Non-interactive grouping content.                           |

## Composition

`DropdownMenu` is the DropdownMenu parts with the trigger and content wired together. For radio groups, submenus and shortcuts, compose `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuRadioGroup`, `DropdownMenuSub` and `DropdownMenuShortcut` directly. Right-click menus use `ContextMenu*`, and application menu bars use `Menubar*`.

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.

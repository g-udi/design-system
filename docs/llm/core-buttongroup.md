# ButtonGroup

> Core/ButtonGroup · core · `@gaudi/design-system/core/ButtonGroup`

Group related actions with joined borders and consistent sizing.

## Import

```js
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `buttonGroupVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `horizontal \| vertical` | `horizontal` | no | Arrangement and accessible orientation of the group. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |
| `ButtonGroupSeparator.orientation` | `horizontal \| vertical` | `vertical` | no | Direction of a divider between actions. |

## Variants

- `orientation`: `horizontal`, `vertical`

## Usage

```jsx
import Button from '@gaudi/design-system/core/Button';
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';

<ButtonGroup aria-label='Document actions'>
  <Button onClick={save}>Save</Button>
  <Button variant='outline' onClick={exportDocument}>Export</Button>
</ButtonGroup>
```

## Accessibility

Buttons retain independent names and focus targets. Use ToggleGroup when the actions represent a selection.

## Examples

- Playground (Storybook `core-buttongroup--playground`)

Curated patterns:

- Collection toolbar — registry item `@gaudi/button-group-collection-toolbar` (uses `Button`, `ButtonGroup`, `ButtonGroupSeparator`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`, `cn`)
- Counts and labels — registry item `@gaudi/button-group-counts-labels` (uses `Badge`, `Button`, `ButtonGroup`, `ButtonGroupText`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`)
- Editor header — registry item `@gaudi/button-group-editor-header` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Button`, `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`)
- Inputs and selects — registry item `@gaudi/button-group-inputs-selects` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `ButtonGroup`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `FieldInput`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `RegistryIcon`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectRoot`, `SelectSeparator`, `SelectTrigger`, `SelectValue`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `cn`)
- Segmented choices — registry item `@gaudi/button-group-segmented` (uses `Badge`, `Button`, `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `cn`)
- Split buttons — registry item `@gaudi/button-group-split-buttons` (uses `Button`, `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`)
- Steppers and pagination — registry item `@gaudi/button-group-steppers-pagination` (uses `Button`, `ButtonGroup`, `ButtonGroupText`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `RegistryIcon`)
- Toolbars — registry item `@gaudi/button-group-toolbars` (uses `Badge`, `Button`, `ButtonGroup`, `ButtonGroupSeparator`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`)
- Vertical groups — registry item `@gaudi/button-group-vertical` (uses `Button`, `ButtonGroup`, `RegistryIcon`, `cn`)

## Related

`core-togglegroup`, `core-direction`

## README

A button group joins related buttons into one control: a toolbar, a split button, a pager, or an input with its action.

```jsx
import { Button, ButtonGroup, ButtonGroupSeparator } from '@gaudi/design-system';

<ButtonGroup aria-label='Reply'>
  <Button>Reply all</Button>
  <ButtonGroupSeparator />
  <Button size='icon' aria-label='More reply options'>…</Button>
</ButtonGroup>
```

- Give each group an `aria-label` so assistive tech announces what the buttons do together.
- `orientation='vertical'` stacks the buttons; turn any `ButtonGroupSeparator` to `horizontal` with it.
- `ButtonGroupText` holds a label or value (such as "Page 2 of 26") inside the group.
- Groups can hold inputs and selects, and can nest to keep a small gap between sets.

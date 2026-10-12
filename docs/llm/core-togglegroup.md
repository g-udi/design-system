# ToggleGroup

> Core/ToggleGroup · core · `@gaudi/design-system/core/ToggleGroup`

Single or multiple pressed choices for view modes and compact formatting controls.

## Import

```js
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Toggle`, `ToggleGroupItem`, `ToggleGroupRoot`, `default`, `toggleVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | no | Accessible name of the group. |
| `options` | `Array<{ value, label, disabled? }>` | `[]` | no | Available choices. |
| `type` | `single \| multiple` | `single` | no | Selection model. |
| `variant` | `outline \| default` | `outline` | no | Attached outline items by default; spacing separates them. |
| `size` | `sm \| default \| lg` | `default` | no | Attached outline items by default; spacing separates them. |
| `spacing` | `number` | `0` | no | Attached outline items by default; spacing separates them. |
| `value / defaultValue / onValueChange` | `string \| string[] / function` | — | no | Controlled or initial selection matching type. |
| `disabled / loop` | `boolean` | `false / true` | no | Group availability and keyboard wrapping. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `type`: `single`, `multiple`
- `variant`: `outline`, `default`
- `size`: `sm`, `default`, `lg`

## Usage

```jsx
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';

<ToggleGroup type='single' label='Display' value={view} onValueChange={setView}
  options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />
```

## Accessibility

Each item communicates its pressed state. Choose radio controls when a form requires exactly one persistent choice.

## Examples

- Playground (Storybook `core-togglegroup--playground`)
- Disabled Options (Storybook `core-togglegroup--disabled-options`)

Curated patterns:

- Filters — registry item `@gaudi/toggle-group-filters` (uses `RegistryIcon`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Icon and label switchers — registry item `@gaudi/toggle-group-switchers` (uses `RegistryIcon`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Group variants, spacing, sizes and orientation — registry item `@gaudi/toggle-group-variants` (uses `Badge`, `RegistryIcon`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Toggle that swaps icon and label — registry item `@gaudi/toggle-icon-label-swap` (uses `RegistryIcon`, `Toggle`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Reactions and counts — registry item `@gaudi/toggle-reactions` (uses `Badge`, `RegistryIcon`, `Toggle`)
- Toggle variants, sizes and states — registry item `@gaudi/toggle-variants` (uses `Button`, `RegistryIcon`, `Toggle`)

## README

A toggle group lets people pick one option (a view mode) or several (filters, formatting) from a short set of buttons.

```jsx
import { ToggleGroup } from '@gaudi/design-system';

<ToggleGroup
  label='Collection view'
  defaultValue='list'
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board', disabled: true }
  ]}
/>
```

- `type='single'` (default) keeps one value and allows clearing it; `type='multiple'` keeps an array.
- `variant` (`outline` or `default`), `size` (`sm`, `default`, `lg`) and `spacing` (0 attaches the items) change the look.
- Icon-only options need an `ariaLabel`.
- For custom item content, compose `ToggleGroupRoot` and `ToggleGroupItem`; use `Toggle` for a single on/off button.
- Arrow keys move between options and skip disabled ones.

# Checkbox

> Core/Checkbox · core · `@gaudi/design-system/core/Checkbox`

Checkbox renders a token-styled binary control.

## Import

```js
import Checkbox from '@gaudi/design-system/core/Checkbox';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `CheckboxRoot`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `generated id` | no | Connects the button control to its visible label. |
| `label` | `ReactNode` | — | no | Visible label text. |
| `checked` | `boolean` | — | no | Controlled checked state. |
| `defaultChecked` | `boolean` | `false` | no | Initial checked state for uncontrolled usage. |
| `disabled` | `boolean` | `false` | no | Prevents changes and lowers visual emphasis. |
| `onCheckedChange` | `(checked) => void` | — | no | Called with the next checked state. |
| `className` | `string` | — | no | Root class override. |

## Usage

```jsx
import { Checkbox } from '@gaudi/design-system';

<Checkbox label='Include drafts' defaultChecked />
```

## Accessibility

Checkbox exposes role checkbox, aria-checked, disabled state, and a visible label when provided.

## Examples

- Playground (Storybook `core-checkbox--playground`)

Curated patterns:

- Corner-check cards — registry item `@gaudi/checkbox-corner-cards` (uses `CheckboxRoot`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldTitle`, `RegistryIcon`)
- Groups — registry item `@gaudi/checkbox-groups` (uses `CheckboxRoot`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `Frame`, `FrameHeader`, `FramePanel`, `FrameTitle`, `RegistryIcon`, `Separator`)
- Label extras and styles — registry item `@gaudi/checkbox-label-extras` (uses `BadgeRoot`, `CheckboxRoot`, `FieldLabelPrimitive`, `FieldRoot`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Nested group — registry item `@gaudi/checkbox-nested-group` (uses `CheckboxRoot`, `FieldLabelPrimitive`, `FieldRoot`)
- Row cards — registry item `@gaudi/checkbox-row-cards` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldTitle`)
- States — registry item `@gaudi/checkbox-states` (uses `CheckboxRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`)

## README

A box people tick to turn one option on or off, or to pick several options from a list. Use a Switch instead when the change applies straight away.

### Usage

```jsx
import { Checkbox } from '@gaudi/design-system';

<Checkbox label='Email me when someone replies' defaultChecked onCheckedChange={setReplies} />;
```

`Checkbox` pairs the box with a clickable label. For descriptions, cards, nested groups or the indeterminate state, compose `CheckboxRoot` with the Field parts (`Field`, `FieldLabel`, `FieldContent`, `FieldDescription`).

### Accessibility

The box is a `checkbox` with `aria-checked` (`mixed` when indeterminate), toggled by Space or a click on its label. A disabled checkbox dims its label too.

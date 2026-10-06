# Switch

> Core/Switch · core · `@gaudi/design-system/core/Switch`

Switch renders a token-styled boolean preference control.

## Import

```js
import Switch from '@gaudi/design-system/core/Switch';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `SwitchRoot`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `generated id` | no | Connects the switch to its visible label. |
| `label` | `ReactNode` | — | no | Visible label text. |
| `checked` | `boolean` | — | no | Controlled checked state. |
| `defaultChecked` | `boolean` | `false` | no | Initial checked state for uncontrolled usage. |
| `size` | `sm \| md \| lg` | `md` | no | Controls track, thumb, and label scale. |
| `disabled` | `boolean` | `false` | no | Prevents changes and lowers visual emphasis. |
| `onCheckedChange` | `(checked) => void` | — | no | Called with the next checked state. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `size`: `sm`, `md`, `lg`

## Usage

```jsx
import { Switch } from '@gaudi/design-system';

<Switch label='Email notifications' defaultChecked />
```

## Accessibility

Switch exposes role switch, aria-checked, disabled state, and a visible label when provided.

## Examples

- Playground (Storybook `core-switch--playground`)
- Controlled (Storybook `core-switch--controlled`)
- Right To Left (Storybook `core-switch--right-to-left`)

Curated patterns:

- Card grid with descriptions — registry item `@gaudi/switch-card-grid` (uses `FieldContent`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldTitle`, `RegistryIcon`, `SwitchRoot`)
- Colours and destructive settings — registry item `@gaudi/switch-colours-destructive` (uses `FieldContent`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `FieldTitle`, `Label`, `SwitchRoot`)
- Labels and states — registry item `@gaudi/switch-labels-states` (uses `BadgeRoot`, `Label`, `RegistryIcon`, `SwitchRoot`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Settings panel — registry item `@gaudi/switch-settings-panel` (uses `Frame`, `FrameHeader`, `FramePanel`, `FrameTitle`, `RegistryIcon`, `Separator`, `SwitchRoot`)

## README

A toggle for a setting that takes effect immediately, such as notifications or dark mode. Use a Checkbox when the choice is only saved with a form.

### Usage

```jsx
import { Switch } from '@gaudi/design-system';

<Switch label='Email notifications' size='md' checked={enabled} onCheckedChange={setEnabled} />;
```

`size` is `sm`, `md` or `lg`. For rows with icons and descriptions, compose `SwitchRoot` (sizes `sm`, `default`, `lg`) with the Field parts.

### Accessibility

The control is a `switch` with `aria-checked`, toggled by Space or a click on its label.

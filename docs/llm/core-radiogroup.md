# RadioGroup

> Core/RadioGroup · core · `@gaudi/design-system/core/RadioGroup`

Choose one option using native radio controls or selectable cards.

## Import

```js
import RadioGroup from '@gaudi/design-system/core/RadioGroup';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `RadioGroupItem`, `RadioGroupRoot`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label / description` | `ReactNode` | — | no | Legend and supporting instructions. |
| `options` | `Array<{ value, label, description?, disabled? }>` | `[]` | no | Mutually exclusive choices. |
| `value / defaultValue / onValueChange` | `string / function` | — | no | Controlled or initial selected value. |
| `name` | `string` | `Generated ID` | no | Shared form field name. |
| `disabled / required` | `boolean` | — | no | Native form constraints. |
| `variant` | `list \| cards` | `list` | no | Choice layout. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `list`, `cards`

## Usage

```jsx
import RadioGroup from '@gaudi/design-system/core/RadioGroup';

<RadioGroup label='Delivery frequency' value={frequency} onValueChange={setFrequency}
  options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />
```

## Accessibility

Native radios provide Arrow-key navigation and form submission. Keep the legend and option labels descriptive.

## Examples

- Playground (Storybook `core-radiogroup--playground`)
- Controlled (Storybook `core-radiogroup--controlled`)

Curated patterns:

- Corner-radio cards — registry item `@gaudi/radio-group-corner-cards` (uses `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FieldTitle`, `RadioGroupItem`, `RadioGroupRoot`, `RegistryIcon`)
- Fieldset, descriptions and states — registry item `@gaudi/radio-group-fieldset-states` (uses `FieldContent`, `FieldDescriptionPrimitive`, `FieldErrorPrimitive`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `RadioGroupItem`, `RadioGroupRoot`)
- Framed lists — registry item `@gaudi/radio-group-framed-lists` (uses `Frame`, `FrameHeader`, `FramePanel`, `FrameTitle`, `RadioGroupItem`, `RadioGroupRoot`, `RegistryIcon`, `Separator`)
- Label extras and layouts — registry item `@gaudi/radio-group-label-extras` (uses `BadgeRoot`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `RadioGroupItem`, `RadioGroupRoot`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Row cards — registry item `@gaudi/radio-group-row-cards` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldLegend`, `FieldRoot`, `FieldSet`, `FieldTitle`, `RadioGroupItem`, `RadioGroupRoot`)

## README

A set of options where people pick exactly one, such as a plan or a delivery speed. Use a Select when there are more than about seven options.

### Usage

```jsx
import { RadioGroup } from '@gaudi/design-system';

<RadioGroup
  label='Reading digest'
  name='digest'
  defaultValue='weekly'
  variant='cards'
  options={[
    { value: 'weekly', label: 'Weekly', description: 'A concise update every Friday.' },
    { value: 'monthly', label: 'Monthly', description: 'The highlights, once a month.' },
    { value: 'off', label: 'Off', disabled: true }
  ]}
/>;
```

`variant='list'` shows compact rows; `cards` makes each option a bordered card. For custom layouts, compose `RadioGroupRoot` and `RadioGroupItem` with the Field parts.

### Accessibility

A fieldset and legend name the group. Arrow keys move the selection and skip disabled options, and `name` and `required` take part in native form submission.

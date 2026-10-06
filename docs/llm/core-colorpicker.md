# ColorPicker

> Core/ColorPicker · core · `@gaudi/design-system/core/ColorPicker`

An inline color canvas with hue, opacity, an eyedropper, and HEX/RGB/HSL/CSS editors.

## Import

```js
import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ColorPicker`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value / defaultValue` | `string` | `#2563eb (defaultValue)` | no | Controlled or initial color: hex, rgb(), rgba(), hsl(), or hsla(). |
| `onValueChange` | `(value: string) => void` | — | no | Receives lowercase #rrggbb, or #rrggbbaa for a translucent color. |
| `defaultFormat` | `hex \| rgb \| hsl \| css` | `hex` | no | Initial editor format. The selector changes presentation without changing the color. |
| `showAlpha` | `boolean` | `true` | no | Show the opacity slider and percentage editor. Hiding them preserves existing alpha. |
| `showEyeDropper` | `boolean` | `true` | no | Show screen sampling, enabled when the browser supports the EyeDropper API in a secure context. |
| `label` | `string` | `Color` | no | Visible label and accessible name for every control. |
| `description` | `ReactNode` | — | no | Help text associated with the canvas keyboard controls and text editor. |
| `swatches` | `string[]` | `[]` | no | Optional color presets. Duplicate and invalid entries are omitted. |
| `disabled / readOnly` | `boolean` | `false` | no | Prevent editing. Read-only values allow format inspection; disabled values are omitted from forms. |
| `name / id` | `string` | — | no | Form field name and hex/CSS input ID. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `defaultFormat`: `hex`, `rgb`, `hsl`, `css`

## Usage

```jsx
import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';

<ColorPicker label='Accent color' value={color} onValueChange={setColor} swatches={['#2563eb', '#16a34a', '#e11d48']} />
```

## Accessibility

The canvas supports mouse, pen, and touch. Its two keyboard stops adjust saturation and brightness with visible thumb focus; hue and opacity also support arrows and Home/End. Presets expose selection with a checkmark and pressed state. Invalid drafts have associated errors.

## Notes

- Hex/CSS text commits on Enter or blur; Escape restores the current color. Invalid drafts never change the selection. RGB and HSL use Gaudi NumberField.
- With opacity controls shown, three- or six-digit hex preserves opacity; four- or eight-digit hex sets alpha explicitly. Screen sampling always preserves opacity. CSS names and other color spaces are unsupported.
- Sampling requires browser support and a secure context. Cancellation is silent. Changing the color, disabling the picker, making it read-only, or hiding/unmounting the eyedropper aborts pending sampling.
- Form reset clears drafts and restores the initial uncontrolled color, notifying only when it changes. Controlled values remain authoritative.
- Layout and interactions are inspired by the shadcn.io Color Picker; all controls use Gaudi styling and primitives.

## Examples

- Playground (Storybook `core-colorpicker--playground`)
- Controlled (Storybook `core-colorpicker--controlled`)
- Form and states (Storybook `core-colorpicker--form-and-states`)

## Related

`core-numberfield`

## README

An inline color editor with a saturation/brightness canvas, hue and opacity sliders, HEX/RGB/HSL/CSS entry, screen eyedropper, and optional preset swatches. Its layout follows the [shadcn.io Color Picker](https://www.shadcn.io/components/color-picker), composed with Gaudi's Slider, Input, NumberField, NativeSelect, and Button primitives.

```jsx
import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';

<ColorPicker
  label='Accent color'
  name='accent'
  value={color}
  onValueChange={setColor}
  swatches={['#2563eb', '#16a34a', '#f59e0b', '#e11d48']}
  description='Used for links and primary actions.'
/>
```

Use `defaultValue` (default `#2563eb`) for uncontrolled state. Values accept three-, four-, six-, or eight-digit hex with an optional `#`, plus numeric `rgb()`, `rgba()`, `hsl()`, and `hsla()` values. RGB percentages, percentage alpha, and space/slash forms are supported; CSS names, variables, and other color spaces are not. Callbacks and form values use lowercase six-digit hex when opaque, or eight digits when translucent. Alpha is quantized to an 8-bit channel. Invalid supplied values fall back to `#2563eb`; invalid and duplicate swatches are omitted.

`defaultFormat` selects the initial editor (`hex`, `rgb`, `hsl`, or `css`). Changing format does not change the selected color. RGB and HSL offer labelled numeric channels; CSS accepts a color expression and displays `rgba()`. Hex and CSS edits commit on Enter or blur. Invalid drafts show an associated error without changing the selection; Escape cancels the draft. A host color change discards pending text permanently. Controlled values remain authoritative, even when the host refuses a change.

`showAlpha` (default `true`) shows the opacity slider and percentage field. Hiding these controls preserves existing alpha; the hex field then includes alpha when present. With opacity controls visible, three- or six-digit hex edits preserve current opacity. Four- or eight-digit hex explicitly replaces alpha. The eyedropper always preserves current opacity; selecting a preset adopts that preset's alpha. `showEyeDropper` (default `true`) shows the sampling button; it is disabled when the browser lacks the EyeDropper API or a secure context. Sampling starts only on a click. Cancellation is silent, failures can be retried, and changing the color, disabling the picker, making it read-only, or hiding/unmounting the eyedropper aborts pending sampling.

`name` submits the current valid color. Form reset clears drafts, restores the initial uncontrolled color, and calls `onValueChange` if it changes. Controlled resets leave the host value intact. `disabled` prevents interaction and form submission. `readOnly` keeps values selectable and submitted; format switching remains available for inspection.

The visible `label` names the group and every control. The canvas uses pointer capture for mouse, pen, and touch; its two keyboard stops reuse Gaudi Slider for saturation and brightness. Arrow keys adjust values, Home/End jump to bounds, and the visible canvas thumb shows keyboard focus. Hue is retained when selecting black or gray. Presets expose selection with a checkmark and `aria-pressed`. Text and numeric editors inherit InputConfigProvider. `description` explains the picker and is associated with its canvas keyboard controls and text editor. `id` targets the hex/CSS input; remaining DOM props and `className` apply to the root group.

The canvas fills its container. At a container width of 20rem (320px at the default root font size) or narrower, the value editor moves below the toolbar; RGB, HSL, and CSS always use a full-width second row. Swatches wrap within the component. No native color popup or additional runtime dependency is required.

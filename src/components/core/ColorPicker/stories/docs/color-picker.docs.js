import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/ColorPicker': {
    ...definition('An inline color canvas with hue, opacity, an eyedropper, and HEX/RGB/HSL/CSS editors.', [
      p('value / defaultValue', 'string', '#2563eb (defaultValue)', 'Controlled or initial color: hex, rgb(), rgba(), hsl(), or hsla().'),
      p('onValueChange', '(value: string) => void', '—', 'Receives lowercase #rrggbb, or #rrggbbaa for a translucent color.'),
      p('defaultFormat', 'hex | rgb | hsl | css', 'hex', 'Initial editor format. The selector changes presentation without changing the color.'),
      p('showAlpha', 'boolean', 'true', 'Show the opacity slider and percentage editor. Hiding them preserves existing alpha.'),
      p('showEyeDropper', 'boolean', 'true', 'Show screen sampling, enabled when the browser supports the EyeDropper API in a secure context.'),
      p('label', 'string', 'Color', 'Visible label and accessible name for every control.'),
      p('description', 'ReactNode', '—', 'Help text associated with the canvas keyboard controls and text editor.'),
      p('swatches', 'string[]', '[]', 'Optional color presets. Duplicate and invalid entries are omitted.'),
      p('disabled / readOnly', 'boolean', 'false', 'Prevent editing. Read-only values allow format inspection; disabled values are omitted from forms.'),
      p('name / id', 'string', '—', 'Form field name and hex/CSS input ID.'),
      className
    ], 'The canvas supports mouse, pen, and touch. Its two keyboard stops adjust saturation and brightness with visible thumb focus; hue and opacity also support arrows and Home/End. Presets expose selection with a checkmark and pressed state. Invalid drafts have associated errors.'),
    usage: "import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';\n\n<ColorPicker label='Accent color' value={color} onValueChange={setColor} swatches={['#2563eb', '#16a34a', '#e11d48']} />",
    notes: [
      'Hex/CSS text commits on Enter or blur; Escape restores the current color. Invalid drafts never change the selection. RGB and HSL use Gaudi NumberField.',
      'With opacity controls shown, three- or six-digit hex preserves opacity; four- or eight-digit hex sets alpha explicitly. Screen sampling always preserves opacity. CSS names and other color spaces are unsupported.',
      'Sampling requires browser support and a secure context. Cancellation is silent. Changing the color, disabling the picker, making it read-only, or hiding/unmounting the eyedropper aborts pending sampling.',
      'Form reset clears drafts and restores the initial uncontrolled color, notifying only when it changes. Controlled values remain authoritative.',
      'Layout and interactions are inspired by the shadcn.io Color Picker; all controls use Gaudi styling and primitives.'
    ]
  }
};

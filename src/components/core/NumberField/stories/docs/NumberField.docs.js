import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/NumberField": {
    ...definition('Numeric entry with increment buttons, bounds, locale formatting and scrubbing.', [p('value / defaultValue / onValueChange', 'number | null / function', '—', 'Controlled or initial numeric value and change callback.'), p('min / max / step', 'number', '—', 'Numeric bounds and increment.'), p('size', 'sm | default | lg', 'default', 'Shared size for input, group and buttons.'), p('format / locale', 'Intl.NumberFormatOptions / string', '—', 'Number formatting and locale.'), p('disabled / readOnly / required', 'boolean', '—', 'Interaction and form state.'), p('NumberFieldScrubArea.label', 'ReactNode', '—', 'Visible label associated with the generated input ID.'), children, className], 'Compose the input and increment/decrement parts inside NumberField. Base UI preserves spinbutton semantics and keyboard adjustment.'),
    usage: "import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement } from '@gaudi/design-system/core/NumberField';\n\n<NumberField value={quantity} onValueChange={setQuantity} min={1}>\n  <NumberFieldGroup><NumberFieldDecrement /><NumberFieldInput aria-label='Quantity' /><NumberFieldIncrement /></NumberFieldGroup>\n</NumberField>",
    notes: ['The text editor inherits InputConfigProvider. Set caretMode="native" or caretMode="smooth" on NumberFieldInput to override the provider. Numeric parsing, formatting, bounds and stepping stay with NumberField.']
  }
};

import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Textarea": {
    ...definition('Multiline text entry that composes with the same labels and errors as Input.', [p('caretMode', 'native | smooth', 'provider / smooth', 'Overrides InputConfigProvider for this field. Smooth mode animates the collapsed caret while supported native text controls retain their editing behavior.'), p('rows', 'number', '4', 'Initial visible line count.'), p('Native textarea props / ref', 'TextareaHTMLAttributes<HTMLTextAreaElement>', '—', 'Value, change callback, name, placeholder, limits, disabled, required and ARIA attributes.'), p('invalid', 'boolean', '—', 'Expose invalid state through FieldTextarea.'), className], 'Use FieldLabel and FieldError. Preserve entered text after a validation or submission failure.'),
    usage: "import Textarea from '@gaudi/design-system/core/Textarea';\n\n<Textarea aria-label='Message' value={message} onChange={event => setMessage(event.target.value)} rows={4} />"
  }
};

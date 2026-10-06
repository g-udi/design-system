import { p, className, nativeInput, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Input": {
    ...definition('Text, search, numeric and date inputs with prefix and suffix slots.', [p('caretMode', 'native | smooth', 'provider / smooth', 'Overrides InputConfigProvider for this field. Smooth mode animates the collapsed caret while supported native text controls retain their editing behavior.'), p('type', 'text | email | search | url | tel | password | number | date', 'text', 'Native input type. Use EmailInput for addresses and NumberField for numeric values to retain the default smooth caret.'), p('prefix / suffix', 'ReactNode', '—', 'Content before or after the native control.'), p('placeholder', 'string', '—', 'Example value; never a replacement for a label.'), p('required / disabled', 'boolean', 'false', 'Native form constraint and availability.'), p('invalid', 'boolean', '—', 'Marks the underlying FieldInput as invalid.'), p('inputClassName', 'string', '—', 'Classes on the input itself.'), className, nativeInput], 'Compose Field, FieldLabel, FieldDescription and FieldError. Keep labels visible and connect errors to their control.'),
    usage: "import Input, { EmailInput } from '@gaudi/design-system/core/Input';\n\n<>\n  <Input aria-label='Project name' value={name} onChange={event => setName(event.target.value)} />\n  <EmailInput aria-label='Email address' name='email' required />\n</>",
    notes: [
      'EmailInput is a named export from the Input entry. It composes Input with a text editor, an email keyboard hint, email autocomplete and single-address pattern validation, so it supports smooth caret mode.',
      'EmailInput fixes type=text and inputMode=email; multiple addresses are unsupported. An additional pattern narrows the allowed addresses. Invalid author patterns are ignored while email validation remains active.',
      'EmailInput keeps raw text (spaces are invalid), reports patternMismatch instead of typeMismatch, and leaves custom error copy to FieldError/onInvalid. required, minLength/maxLength, name, form, value/defaultValue, refs and event handlers reach the native editor.',
      'Smooth caret is enabled by default. Use EmailInput for addresses and NumberField for numeric values throughout forms and examples; reserve native email/number types for documented semantic exceptions. Provider and per-field caretMode=native overrides remain available.'
    ]
  }
};

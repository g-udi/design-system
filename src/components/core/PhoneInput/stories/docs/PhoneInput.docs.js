import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/PhoneInput": {
    ...definition('International phone entry with country selection and formatted numbers.', [p('value', 'string', '—', 'Phone number in international format.'), p('onChange', '(value: string) => void', '—', 'Receives the entered number; cleared values are normalized to an empty string.'), p('defaultCountry', 'CountryCode', '—', 'Initial country when no international prefix is entered.'), p('variant', 'sm | default | lg', 'default', 'Height of the country button and input.'), p('disabled / international', 'boolean', '—', 'Input availability and international number formatting.'), p('popupClassName / scrollAreaClassName', 'string', '—', 'Country menu and scrolling-region classes.'), className], 'Associate a visible label with the input and name the country selector. The application owns phone verification and validity feedback.'),
    usage: "import { PhoneInput } from '@gaudi/design-system/core/PhoneInput';\n\n<PhoneInput aria-label='Phone number' value={phone} onChange={setPhone} defaultCountry='GB' />"
  }
};

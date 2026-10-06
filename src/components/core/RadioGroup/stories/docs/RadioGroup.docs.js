import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/RadioGroup": {
    ...definition('Choose one option using native radio controls or selectable cards.', [p('label / description', 'ReactNode', '—', 'Legend and supporting instructions.'), p('options', 'Array<{ value, label, description?, disabled? }>', '[]', 'Mutually exclusive choices.'), p('value / defaultValue / onValueChange', 'string / function', '—', 'Controlled or initial selected value.'), p('name', 'string', 'Generated ID', 'Shared form field name.'), p('disabled / required', 'boolean', '—', 'Native form constraints.'), p('variant', 'list | cards', 'list', 'Choice layout.'), className], 'Native radios provide Arrow-key navigation and form submission. Keep the legend and option labels descriptive.'),
    usage: "import RadioGroup from '@gaudi/design-system/core/RadioGroup';\n\n<RadioGroup label='Delivery frequency' value={frequency} onValueChange={setFrequency}\n  options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />"
  }
};

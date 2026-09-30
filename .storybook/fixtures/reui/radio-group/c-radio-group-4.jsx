// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <RadioGroup defaultValue='email' className='w-fit'>
      <Field orientation='horizontal' data-invalid>
        <RadioGroupItem value='email' id='invalid-r1' aria-invalid />
        <FieldLabel htmlFor='invalid-r1'>Email only</FieldLabel>
      </Field>
      <Field orientation='horizontal' data-invalid>
        <RadioGroupItem value='sms' id='invalid-r2' aria-invalid />
        <FieldLabel htmlFor='invalid-r2'>SMS only</FieldLabel>
      </Field>
    </RadioGroup>
  );
}

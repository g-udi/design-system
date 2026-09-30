// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Input
        aria-label='Basic Input'
        id='basic-input'
        type='text'
        placeholder='Basic Input'
      />
    </Field>
  );
}

// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='pill-input'>Search</FieldLabel>
      <Input
        id='pill-input'
        className='rounded-full px-4'
        placeholder='Search everything...'
      />
    </Field>
  );
}

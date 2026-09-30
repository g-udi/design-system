// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='minimal-input'>Invisible Input</FieldLabel>
      <Input
        id='minimal-input'
        placeholder='Type here...'
        className='border-none bg-transparent p-0 shadow-none focus-visible:ring-0'
      />
    </Field>
  );
}

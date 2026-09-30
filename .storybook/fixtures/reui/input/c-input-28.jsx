// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='color-picker'>Theme Color</FieldLabel>
      <Input
        id='color-picker'
        type='color'
        className='h-10 w-20 cursor-pointer p-1'
        defaultValue='#3b82f6'
      />
    </Field>
  );
}

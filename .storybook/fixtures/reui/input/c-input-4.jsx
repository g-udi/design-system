// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='input-demo-disabled'>Email</FieldLabel>
      <Input
        id='input-demo-disabled'
        type='email'
        placeholder='Email'
        disabled
      />
    </Field>
  );
}

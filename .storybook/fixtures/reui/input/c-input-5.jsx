// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='input-demo-error'>Email</FieldLabel>
      <Input
        id='input-demo-error'
        type='email'
        placeholder='name@example.com'
        aria-invalid='true'
      />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  );
}

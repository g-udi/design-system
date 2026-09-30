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

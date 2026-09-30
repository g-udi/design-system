import {
  Field,
  FieldError
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs' data-invalid='true'>
      <Label htmlFor='label-error'>Email</Label>
      <Input
        id='label-error'
        type='email'
        defaultValue='invalid-email'
        aria-invalid='true'
      />
      <FieldError>Please enter a valid email address</FieldError>
    </Field>
  );
}

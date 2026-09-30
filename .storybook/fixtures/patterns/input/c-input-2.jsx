import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='input-demo-email'>Email</FieldLabel>
      <Input
        id='input-demo-email'
        type='email'
        placeholder='name@example.com'
      />
    </Field>
  );
}

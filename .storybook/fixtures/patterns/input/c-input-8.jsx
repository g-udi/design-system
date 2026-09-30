import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='input-demo-tel'>Phone</FieldLabel>
      <Input id='input-demo-tel' type='tel' placeholder='+1 (555) 123-4567' />
    </Field>
  );
}

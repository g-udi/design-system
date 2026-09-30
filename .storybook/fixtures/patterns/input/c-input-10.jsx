import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='input-demo-number'>Number</FieldLabel>
      <Input id='input-demo-number' type='number' placeholder='123' />
    </Field>
  );
}

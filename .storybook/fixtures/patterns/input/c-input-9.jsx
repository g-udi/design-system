import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='input-demo-url'>URL</FieldLabel>
      <Input id='input-demo-url' type='url' placeholder='https://example.com' />
    </Field>
  );
}

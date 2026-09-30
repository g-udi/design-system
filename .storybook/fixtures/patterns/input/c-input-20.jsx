import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field orientation='horizontal' className='w-full max-w-xs'>
      <FieldLabel htmlFor='horizontal-name' className='w-24'>
        Name
      </FieldLabel>
      <Input id='horizontal-name' placeholder='John Doe' />
    </Field>
  );
}

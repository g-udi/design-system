import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='company'>
        Company <span className='text-ui-destructive'>*</span>
      </FieldLabel>
      <Input id='company' placeholder='Wotso Inc.' />
    </Field>
  );
}

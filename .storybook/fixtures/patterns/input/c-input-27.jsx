import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='bottom-border'>Bottom Border Only</FieldLabel>
      <Input
        id='bottom-border'
        className='focus-visible:border-ui-primary rounded-none border-x-0 border-t-0 border-b-2 px-0 shadow-none focus-visible:ring-0'
        placeholder='Type here...'
      />
    </Field>
  );
}

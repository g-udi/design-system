import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Field className='w-full'>
        <FieldLabel htmlFor='textarea-disabled'>Message (Disabled)</FieldLabel>
        <Textarea
          id='textarea-disabled'
          placeholder='Type your message here…'
          disabled
        />
      </Field>
    </div>
  );
}

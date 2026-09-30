// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Field className='w-full'>
        <FieldLabel htmlFor='textarea-with-desc'>Feedback</FieldLabel>
        <Textarea
          id='textarea-with-desc'
          placeholder='Type your message here…'
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </div>
  );
}

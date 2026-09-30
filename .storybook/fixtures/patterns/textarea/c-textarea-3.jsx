import {
  default as Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/index.js';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg items-start gap-3 sm:grid-cols-2'>
      <Field>
        <FieldLabel htmlFor='textarea-feedback'>Feedback</FieldLabel>
        <Textarea id='textarea-feedback' placeholder='Type your message here…' rows={3} />
        <FieldDescription>Shared with the editors.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor='textarea-notes'>Review notes</FieldLabel>
        <Textarea id='textarea-notes' rows={3} />
        <FieldError>Add a reason before returning this draft.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor='textarea-disabled'>Internal memo</FieldLabel>
        <Textarea id='textarea-disabled' placeholder='Locked while the draft is in review' rows={3} disabled />
        <FieldDescription>Disabled</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor='textarea-readonly'>Published summary</FieldLabel>
        <Textarea
          id='textarea-readonly'
          rows={3}
          readOnly
          defaultValue='An introduction to knowledge graphs and the questions they answer.'
        />
        <FieldDescription>Read-only: focusable and selectable.</FieldDescription>
      </Field>
    </div>
  );
}

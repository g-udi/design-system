import { useId } from 'react';
import {
  default as Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@gaudi/design-system/core/Field';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';

export function Pattern() {
  const id = useId();
  return (
    <div className='mx-auto grid w-full max-w-xl items-start gap-x-5 gap-y-6 sm:grid-cols-2'>
      <Field>
        <FieldLabel htmlFor={`${id}-textarea-feedback`}>Feedback</FieldLabel>
        <Textarea id={`${id}-textarea-feedback`} placeholder='Type your message here…' rows={3} />
        <FieldDescription>Shared with the editors.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-textarea-notes`}>Review notes</FieldLabel>
        <Textarea id={`${id}-textarea-notes`} rows={3} />
        <FieldError>Add a reason before returning this draft.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-textarea-disabled`}>Internal memo</FieldLabel>
        <Textarea id={`${id}-textarea-disabled`} placeholder='Locked while the draft is in review' rows={3} disabled />
        <FieldDescription>Disabled</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-textarea-readonly`}>Published summary</FieldLabel>
        <Textarea
          id={`${id}-textarea-readonly`}
          rows={3}
          readOnly
          defaultValue='An introduction to knowledge graphs and the questions they answer.'
        />
        <FieldDescription>Read-only: focusable and selectable.</FieldDescription>
      </Field>
    </div>
  );
}

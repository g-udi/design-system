import { useState } from 'react';
import Avatar from '@gaudi/design-system/core/Avatar';
import Field, { FieldLabel, FieldError, FieldDescription } from '@gaudi/design-system/core/Field';
import Textarea from '@gaudi/design-system/core/Textarea';
import Button from '@gaudi/design-system/core/Button';

const noteLabel = 'Note to the author';

const draftNote = 'The introduction is strong. Could the second section open with the diagram instead of the table?';

const limit = 280;

const errorText = 'Name the section that needs changes before returning.';

function ReviewComposer({ invalid, onChange, ...args }) {
  const [value, setValue] = useState(draftNote);
  const update = (event) => {
    setValue(event.target.value);
    onChange?.(event);
  };
  return (
    <div className='grid gap-3 rounded-lg border border-border p-3'>
      <div className='flex items-center gap-3'>
        <Avatar name='Sam Rivera' size='sm' />
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium'>Return “Knowledge graphs in practice”</p>
          <p className='text-xs text-text-muted'>Sam Rivera will be notified by email.</p>
        </div>
      </div>
      <Field>
        <FieldLabel>
          {noteLabel}
          {args.required ? <span className='text-danger' aria-hidden='true'>*</span> : <span className='font-normal text-text-muted'>(optional)</span>}
        </FieldLabel>
        <Textarea {...args} invalid={invalid} maxLength={limit} value={value} onChange={update} />
        {invalid ? <FieldError>{errorText}</FieldError> : <FieldDescription>Visible to the author and co-editors.</FieldDescription>}
      </Field>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <span className='text-xs text-text-muted tabular-nums'>{value.length} / {limit}</span>
        <div className='flex gap-2'>
          <Button size='sm' variant='ghost' tone='neutral' disabled={args.disabled}>Cancel</Button>
          <Button size='sm' disabled={args.disabled}>Return draft</Button>
        </div>
      </div>
    </div>
  );
}

export const exampleDefaults = { rows: 4, disabled: false, required: true, invalid: false };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <ReviewComposer {...args} />;
}

export { noteLabel, draftNote, limit, errorText };

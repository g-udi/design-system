'use client';
import { useId, useState } from 'react';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
const MAX_CHARS = 280;
export function Pattern() {
  const id = useId();
  const [value, setValue] = useState('');
  const remaining = MAX_CHARS - value.length;
  const isNearLimit = remaining <= 20;
  const isAtLimit = remaining === 0;
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Field className='w-full'>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor={`${id}-auto-resize-textarea`}>Bio</FieldLabel>
          <span
            className={`text-xs tabular-nums ${isAtLimit ? 'text-danger font-semibold' : isNearLimit ? 'text-warning' : 'text-text-muted'}`}
          >
            {value.length}/{MAX_CHARS}
          </span>
        </div>
        <Textarea
          id={`${id}-auto-resize-textarea`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={MAX_CHARS}
          placeholder='Tell us about yourself...'
          rows={2}
          className='field-sizing-content resize-none overflow-hidden'
        />
      </Field>
    </div>
  );
}

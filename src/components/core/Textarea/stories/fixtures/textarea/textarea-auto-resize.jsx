'use client';
import { CharacterCount } from '@gaudi/design-system/blocks/Forms';
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
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Field className='w-full'>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor={`${id}-auto-resize-textarea`}>Bio</FieldLabel>
          <CharacterCount id={`${id}-count`} value={value} max={MAX_CHARS} />
        </div>
        <Textarea
          id={`${id}-auto-resize-textarea`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={`${id}-count`}
          maxLength={MAX_CHARS}
          placeholder='Tell us about yourself...'
          rows={2}
          className='field-sizing-content resize-none overflow-hidden'
        />
      </Field>
    </div>
  );
}

'use client';
import { useCallback, useRef, useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
const MAX_CHARS = 280;
export function Pattern() {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setValue(newValue);
    }
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);
  const remaining = MAX_CHARS - value.length;
  const isNearLimit = remaining <= 20;
  const isAtLimit = remaining === 0;
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Field className='w-full'>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor='auto-resize-textarea'>Bio</FieldLabel>
          <span
            className={`text-xs tabular-nums ${isAtLimit ? 'text-danger font-semibold' : isNearLimit ? 'text-warning' : 'text-text-muted'}`}
          >
            {value.length}/{MAX_CHARS}
          </span>
        </div>
        <Textarea
          ref={textareaRef}
          id='auto-resize-textarea'
          value={value}
          onChange={handleChange}
          placeholder='Tell us about yourself...'
          rows={2}
          className='resize-none overflow-hidden'
        />
      </Field>
    </div>
  );
}

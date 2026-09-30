// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Field className='max-w-xs'>
      <FieldLabel htmlFor='pulsed-input'>Pulsed Background</FieldLabel>
      <div className='relative'>
        <div
          className={`bg-ui-primary/20 pointer-events-none absolute inset-0 rounded-md transition-opacity duration-300 ${isFocused ? 'opacity-0' : 'animate-pulse'}`}
        />
        <Input
          id='pulsed-input'
          placeholder='Animation stops on focus...'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className='focus-visible:bg-ui-background relative bg-transparent shadow-none transition-colors duration-300'
        />
      </div>
    </Field>
  );
}

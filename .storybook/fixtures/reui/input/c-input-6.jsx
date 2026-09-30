// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  const [value, setValue] = useState('');
  const maxLength = 50;
  return (
    <Field className='max-w-xs'>
      <div className='flex items-center justify-between'>
        <FieldLabel htmlFor='bio'>Description</FieldLabel>
        <span className='text-ui-muted-foreground text-xs'>
          {value.length}/{maxLength}
        </span>
      </div>
      <Input
        id='bio'
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Description of your project'
      />
    </Field>
  );
}

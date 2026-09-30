// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
export function Pattern() {
  const [length, setLength] = useState(0);
  return (
    <Field className='w-full max-w-xs'>
      <Label htmlFor='label-counter' className='justify-between'>
        Bio
        <span className='text-ui-muted-foreground'>{length}/200</span>
      </Label>
      <Textarea
        id='label-counter'
        placeholder='Tell us about yourself…'
        maxLength={200}
        onChange={(e) => setLength(e.target.value.length)}
      />
    </Field>
  );
}

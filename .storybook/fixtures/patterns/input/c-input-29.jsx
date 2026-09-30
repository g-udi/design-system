'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  const [value, setValue] = useState(50);
  return (
    <Field className='w-full max-w-xs'>
      <div className='flex items-center justify-between'>
        <FieldLabel htmlFor='range-slider'>Volume</FieldLabel>
        <span className='text-ui-muted-foreground text-xs font-medium'>
          {value}
        </span>
      </div>
      <Input
        id='range-slider'
        type='range'
        min='0'
        max='100'
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className='bg-ui-muted accent-ui-primary h-2 cursor-pointer appearance-none'
      />
    </Field>
  );
}

'use client';
import { useState } from 'react';
import { EmailInput } from '@gaudi/design-system/core/Input';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';

const types = [
  { type: 'text', label: 'Text', placeholder: 'Project name' },
  { type: 'email', label: 'Email', placeholder: 'name@example.com' },
  { type: 'password', label: 'Password', placeholder: 'Password' },
  { type: 'tel', label: 'Phone', placeholder: '+1 (555) 123-4567' },
  { type: 'url', label: 'URL', placeholder: 'https://example.com' },
  { type: 'number', label: 'Number', placeholder: '123' },
  { type: 'date', label: 'Date' },
  { type: 'time', label: 'Time' }
];

export function Pattern() {
  const [volume, setVolume] = useState(50);
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      {types.map(({ type, label, placeholder }) => (
        <Field key={type}>
          <FieldLabel htmlFor={`input-type-${type}`}>{label}</FieldLabel>
          {type === 'email' ? <EmailInput id={`input-type-${type}`} placeholder={placeholder} /> : type === 'number' ? (
            <NumberField id={`input-type-${type}`}><NumberFieldGroup><NumberFieldInput placeholder={placeholder} /></NumberFieldGroup></NumberField>
          ) : <Input id={`input-type-${type}`} type={type} placeholder={placeholder} />}
        </Field>
      ))}
      <Field className='sm:col-span-2'>
        <FieldLabel htmlFor='input-type-file'>File</FieldLabel>
        <Input id='input-type-file' type='file' />
      </Field>
      <Field>
        <FieldLabel htmlFor='input-type-color'>Theme colour</FieldLabel>
        <Input id='input-type-color' type='color' className='h-8 w-16! cursor-pointer p-1' defaultValue='#3b82f6' />
      </Field>
      <Field>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor='input-type-range'>Range</FieldLabel>
          <span className='text-xs font-medium tabular-nums text-text-muted'>{volume}</span>
        </div>
        <Input
          id='input-type-range'
          type='range'
          min='0'
          max='100'
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value, 10))}
          className='cursor-pointer border-none bg-transparent px-0 shadow-none accent-accent dark:bg-transparent'
        />
      </Field>
    </div>
  );
}

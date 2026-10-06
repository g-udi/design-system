'use client';
import { useState } from 'react';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';

// The base input sets its own dark fill and border, so each style repeats its override under `dark:`.
const styles = [
  { id: 'subtle', label: 'Subtle background', placeholder: 'Enter text…', className: 'bg-surface-muted dark:bg-surface-muted' },
  { id: 'underline', label: 'Bottom border only', placeholder: 'Type here…', className: 'rounded-none border-x-0 border-t-0 border-b-2 px-0 shadow-none bg-transparent dark:bg-transparent focus-visible:border-accent focus-visible:ring-0 focus-visible:ring-offset-0' },
  { id: 'pill', label: 'Pill', placeholder: 'Search everything…', className: 'rounded-full px-4' },
  { id: 'focus', label: 'Custom focus ring', placeholder: 'Success-coloured focus', className: 'focus-visible:border-success focus-visible:ring-success/50 dark:focus-visible:border-success dark:focus-visible:ring-success/50' },
  { id: 'minimal', label: 'Minimal', placeholder: 'No border or background…', className: 'border-none bg-transparent px-0 shadow-none dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0' }
];

export function Pattern() {
  const [focused, setFocused] = useState(false);
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      {styles.map((style) => (
        <Field key={style.id}>
          <FieldLabel htmlFor={`input-style-${style.id}`}>{style.label}</FieldLabel>
          <Input id={`input-style-${style.id}`} placeholder={style.placeholder} className={style.className} />
        </Field>
      ))}
      {/* A pulsing fill draws attention until the field is focused. */}
      <Field>
        <FieldLabel htmlFor='input-style-pulse'>Pulsed background</FieldLabel>
        <div className='relative'>
          <div
            aria-hidden='true'
            className={`pointer-events-none absolute inset-0 rounded-md bg-accent/20 transition-opacity duration-300 ${focused ? 'opacity-0' : 'animate-pulse'}`}
          />
          <Input
            id='input-style-pulse'
            placeholder='Stops on focus…'
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className='relative bg-transparent shadow-none dark:bg-transparent focus-visible:bg-surface dark:focus-visible:bg-surface'
          />
        </div>
      </Field>
    </div>
  );
}

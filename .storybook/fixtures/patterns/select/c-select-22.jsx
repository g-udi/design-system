'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' }
];

// A controlled select that swaps its up-down chevrons for a clear button once a
// value is picked, with the check indicator moved to the left of each option.
export function Pattern() {
  const [value, setValue] = useState('svelte');
  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Field className='mx-auto w-full max-w-xs'>
      <FieldLabel htmlFor='select-framework'>Framework</FieldLabel>
      <Select key={value || 'empty'} value={value} onValueChange={setValue}>
        <SelectTrigger id='select-framework' className='w-full [&>svg:last-child]:hidden!'>
          <SelectValue placeholder='Select framework' />
          {value ? (
            <span
              role='button'
              tabIndex={-1}
              aria-label='Clear selection'
              onPointerDown={stop}
              onClick={(event) => {
                stop(event);
                setValue('');
              }}
              className='flex size-4 items-center justify-center rounded-sm text-text-muted hover:text-text'
            >
              <RegistryIcon lucide='XIcon' className='size-4' />
            </span>
          ) : (
            <RegistryIcon lucide='ChevronsUpDownIcon' className='size-4 text-text-muted' />
          )}
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {frameworks.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className='pr-2! pl-8 [&>span:first-child]:right-auto! [&>span:first-child]:left-2!'
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

'use client';
import { useId, useRef, useState } from 'react';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import {
  SelectRoot as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import Button from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' }
];

// A controlled select with a keyboard-accessible clear action beside its trigger.
export function Pattern() {
  const [value, setValue] = useState('svelte');
  const id = useId();
  const triggerRef = useRef(null);
  return (
    <Field className='mx-auto w-full max-w-xs'>
      <FieldLabel htmlFor={id}>Framework</FieldLabel>
      <Select value={value} onValueChange={setValue}>
        <div className='flex min-w-0 items-center gap-1'>
          <SelectTrigger ref={triggerRef} id={id} className='w-full'>
            <SelectValue placeholder='Select framework' />
          </SelectTrigger>
          <Button
            size='icon'
            variant='ghost'
            tone='neutral'
            aria-label='Clear selection'
            disabled={!value}
            onClick={() => {
              setValue('');
              triggerRef.current?.focus();
            }}
          >
            <RegistryIcon lucide='XIcon' />
          </Button>
        </div>
        <SelectContent position='popper'>
          <SelectGroup>
            {frameworks.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className='pe-2! ps-8 [&>span:first-child]:end-auto! [&>span:first-child]:start-2!'
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

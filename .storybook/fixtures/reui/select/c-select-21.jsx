// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' }
];
export function Pattern() {
  const [value, setValue] = useState('');
  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValue('');
  };
  return (
    <Field className='max-w-xs'>
      <Select key={value || '__empty__'} value={value} onValueChange={setValue}>
        <SelectTrigger
          aria-label='Select framework'
          className={cn(value !== '' && '[&>svg:last-child]:hidden!')}
        >
          <SelectValue placeholder='Select framework' />
          {value !== '' ? (
            <div
              role='button'
              tabIndex={-1}
              onClick={handleClear}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className='text-ui-muted-foreground hover:text-ui-foreground flex size-4 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none'
            >
              <RegistryIcon lucide='XIcon' className='size-4' />
              <span className='sr-only'>Clear selection</span>
            </div>
          ) : null}
        </SelectTrigger>
        <SelectContent position='popper'>
          {frameworks.map((framework) => (
            <SelectItem key={framework.value} value={framework.value}>
              {framework.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

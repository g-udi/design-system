// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Strawberry', value: 'strawberry' }
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
          aria-label='Select an option'
          className='w-[200px] [&>svg:last-child]:hidden!'
        >
          <SelectValue placeholder='Select an option' />
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
          ) : (
            <RegistryIcon
              lucide='ChevronsUpDownIcon'
              className='text-ui-muted-foreground size-4'
            />
          )}
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

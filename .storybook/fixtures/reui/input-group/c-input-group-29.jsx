// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [category, setCategory] = useState('Category');
  return (
    <Field className='max-w-xs'>
      <InputGroup className='rounded-full'>
        <InputGroupInput
          aria-label='Search products'
          placeholder='Search products'
          className='rounded-full px-5'
        />
        <InputGroupAddon align='inline-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                aria-label='Show options'
                variant='ghost'
                className='h-7 rounded-full px-3 text-xs'
              >
                {category}
                <RegistryIcon
                  lucide='ChevronDownIcon'
                  className='ml-1 size-3.5 opacity-60'
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-32'>
              <DropdownMenuItem onClick={() => setCategory('Electronics')}>
                Electronics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory('Clothing')}>
                Clothing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory('Home')}>
                Home
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

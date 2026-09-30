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
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [visibility, setVisibility] = useState('Personal');
  return (
    <Field className='mx-auto w-full max-w-lg'>
      <InputGroup className='bg-surface h-auto flex-row! flex-wrap items-start p-3 pl-4'>
        <InputGroupAddon className='border-border bg-surface-muted mt-1.5 inline-flex size-8 items-center justify-center rounded-md border p-0'>
          <RegistryIcon
            lucide='LayersIcon'
            className='text-text-muted size-4'
          />
        </InputGroupAddon>

        <div className='flex min-w-0 flex-1 flex-col pt-2.5 pl-1'>
          <InputGroupInput
            aria-label='Enter project name...'
            placeholder='Enter project name...'
            className='h-10 border-none text-base shadow-none focus-visible:ring-0'
          />
          <InputGroupTextarea
            aria-label='Description as multiple lines of text are supported...'
            placeholder='Description as multiple lines of text are supported...'
            className='text-text-muted min-h-12 border-none text-sm shadow-none focus-visible:ring-0'
          />
        </div>

        <InputGroupAddon
          align='block-end'
          className='flex-wrap gap-2 border-none'
        >
          <InputGroupText className='text-text-muted text-sm whitespace-nowrap'>
            Save to
          </InputGroupText>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant='outline'
                size='sm'
                className='h-8 gap-2 font-normal'
              >
                <RegistryIcon lucide='LockIcon' className='size-3.5' />
                {visibility}
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setVisibility('Personal')}>
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility('Team')}>
                Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility('Public')}>
                Public
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='bg-border mx-1 h-4 w-px self-center' />

          <InputGroupButton variant='secondary' size='sm'>
            Cancel
          </InputGroupButton>
          <InputGroupButton variant='default' size='sm'>
            Save
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

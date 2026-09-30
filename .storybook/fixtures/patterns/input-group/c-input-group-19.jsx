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
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [model, setModel] = useState('GPT-4o');
  return (
    <Field className='max-w-xs'>
      <InputGroup className='bg-ui-background'>
        <InputGroupAddon align='block-start' className='gap-2 px-3 pt-3'>
          <InputGroupButton
            aria-label='Mention someone'
            variant='outline'
            size='icon-xs'
          >
            <RegistryIcon lucide='AtSignIcon' className='size-3.5' />
          </InputGroupButton>
          <InputGroupButton variant='outline'>
            <RegistryIcon
              lucide='PaperclipIcon'
              className='size-3.5 not-only:rotate-45'
            />
            1
          </InputGroupButton>
          <InputGroupButton variant='outline'>
            <RegistryIcon
              lucide='FileTextIcon'
              className='size-3.5 not-only:rotate-45'
            />
            1 Tab
          </InputGroupButton>
        </InputGroupAddon>

        <InputGroupTextarea
          aria-label='Plan, search, build anything'
          placeholder='Plan, search, build anything'
          className='min-h-24 border-none py-4 shadow-none focus-visible:ring-0'
        />

        <InputGroupAddon align='block-end' className='px-3 pb-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                aria-label='Show options'
                variant='secondary'
                size='sm'
              >
                {model}
                <RegistryIcon lucide='ChevronDownIcon' />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem onClick={() => setModel('GPT-4o')}>
                GPT-4o
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModel('Claude 3.5 Sonnet')}>
                Claude 3.5 Sonnet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='ml-auto flex items-center gap-2'>
            <InputGroupButton
              aria-label='Attach image'
              variant='secondary'
              size='icon-sm'
            >
              <RegistryIcon
                lucide='ImageIcon'
                className='text-ui-muted-foreground'
              />
            </InputGroupButton>
            <InputGroupButton
              aria-label='Send message'
              variant='default'
              size='icon-sm'
            >
              <RegistryIcon lucide='CornerDownLeftIcon' />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

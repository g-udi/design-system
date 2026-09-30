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
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [model, setModel] = useState('GPT-4o');
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupTextarea
          aria-label='Ask AI anything...'
          placeholder='Ask AI anything...'
          className='min-h-24 pb-12'
        />
        <InputGroupAddon align='block-end'>
          <div className='flex items-center gap-1'>
            <InputGroupButton aria-label='Add' variant='ghost' size='icon-xs'>
              <RegistryIcon lucide='PlusIcon' className='size-4' />
            </InputGroupButton>
            <InputGroupButton
              aria-label='Use microphone'
              variant='ghost'
              size='icon-xs'
            >
              <RegistryIcon lucide='MicIcon' className='size-4' />
            </InputGroupButton>
            <InputGroupButton variant='ghost' className='h-7 px-2 text-xs'>
              <RegistryIcon lucide='GlobeIcon' className='mr-1 size-3.5' />
              Search
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant='ghost' className='h-7 px-2 text-xs'>
                  <Kbd className='border-ui-border rounded-sm border'>Σ</Kbd>
                  {model}
                  <RegistryIcon
                    lucide='ChevronDownIcon'
                    className='ml-1 size-3.5 opacity-60'
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='min-w-32'>
                <DropdownMenuItem onClick={() => setModel('GPT-4o')}>
                  GPT-4o
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModel('GPT-4')}>
                  GPT-4
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModel('Claude 3.5')}>
                  Claude 3.5
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <InputGroupButton
            aria-label='Send message'
            variant='default'
            size='icon-xs'
            className='ml-auto'
          >
            <RegistryIcon lucide='ArrowUpIcon' className='size-4' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

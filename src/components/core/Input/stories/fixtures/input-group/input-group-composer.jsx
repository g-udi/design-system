'use client';
import { useState } from 'react';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Separator } from '@gaudi/design-system/core/Separator';
import { FieldRoot as Field } from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
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
            value={title} onChange={(event) => setTitle(event.target.value)}
            aria-label='Name this collection...'
            placeholder='Name this collection...'
            className='h-10 border-none text-base shadow-none focus-visible:ring-0'
          />
          <InputGroupTextarea
            value={description} onChange={(event) => setDescription(event.target.value)}
            aria-label='Add a short introduction. Line breaks are kept...'
            placeholder='Add a short introduction. Line breaks are kept...'
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

          <Separator orientation='vertical' className='mx-1 h-4 self-center' />

          <InputGroupButton variant='secondary' size='sm' onClick={() => { setTitle(''); setDescription(''); setVisibility('Personal'); setFeedback('Draft cleared.'); }}>
            Cancel
          </InputGroupButton>
          <InputGroupButton variant='default' size='sm' disabled={!title.trim()} onClick={() => setFeedback(`${title.trim()} saved to ${visibility} in this demo.`)}>
            Save
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <p role='status' className='text-xs text-text-muted'>{feedback}</p>
    </Field>
  );
}

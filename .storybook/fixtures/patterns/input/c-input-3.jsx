'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const codeErrors = [
  'At least 12 characters long',
  'At least one uppercase letter',
  'No common words or patterns'
];
const maxLength = 50;

export function Pattern() {
  const [description, setDescription] = useState('');
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
        <Field>
          <div className='flex items-center gap-1.5'>
            <FieldLabel htmlFor='input-username'>Username</FieldLabel>
            <Tooltip>
              <TooltipTrigger className='inline-flex items-center text-text-muted' aria-label='About usernames'>
                <RegistryIcon lucide='HelpCircleIcon' className='size-3.5' />
              </TooltipTrigger>
              <TooltipContent>Shown on your profile and in mentions.</TooltipContent>
            </Tooltip>
          </div>
          <Input id='input-username' placeholder='johndoe' />
          <FieldDescription>Your unique identifier.</FieldDescription>
        </Field>
        <Field>
          <div className='flex items-center justify-between gap-2'>
            <FieldLabel htmlFor='input-description'>Description</FieldLabel>
            <span className='text-xs tabular-nums text-text-muted'>{description.length}/{maxLength}</span>
          </div>
          <Input
            id='input-description'
            maxLength={maxLength}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='What is this project about?'
          />
        </Field>
        <Field>
          <div className='flex items-center gap-2'>
            <FieldLabel htmlFor='input-api-key'>API key</FieldLabel>
            <Badge variant='success-light' size='sm'>New</Badge>
          </div>
          <Input id='input-api-key' className='font-mono' placeholder='9f82a1c4b7e243d8' />
        </Field>
        <Field>
          <div className='flex items-center justify-between gap-2'>
            <FieldLabel htmlFor='input-middle-name'>Middle name</FieldLabel>
            <Badge variant='warning-outline' size='sm'>Optional</Badge>
          </div>
          <Input id='input-middle-name' placeholder='Alexander' />
        </Field>
        <Field orientation='horizontal' className='sm:col-span-2'>
          <FieldLabel htmlFor='input-horizontal' className='w-24 shrink-0'>Full name</FieldLabel>
          <Input id='input-horizontal' placeholder='John Doe' />
        </Field>
        <Field className='sm:col-span-2' data-invalid>
          <FieldLabel htmlFor='input-security-code'>Security code</FieldLabel>
          <Input id='input-security-code' defaultValue='gaudi' aria-invalid='true' aria-describedby='input-security-errors' />
          <FieldError id='input-security-errors' className='grid gap-1 text-xs'>
            {codeErrors.map((error) => (
              <span key={error} className='flex items-center gap-1.5'>
                <RegistryIcon lucide='CircleAlertIcon' className='size-3.5 shrink-0' aria-hidden='true' />
                {error}
              </span>
            ))}
          </FieldError>
        </Field>
      </div>
    </TooltipProvider>
  );
}

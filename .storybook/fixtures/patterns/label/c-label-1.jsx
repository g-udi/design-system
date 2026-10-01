'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Field, FieldDescription } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

export function Pattern() {
  const [bio, setBio] = useState(0);
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
        <Field>
          <Label htmlFor='label-required'>
            Email address
            <span className='text-danger'>*</span>
          </Label>
          <Input id='label-required' type='email' placeholder='you@example.com' required />
        </Field>
        <Field>
          <Label htmlFor='label-optional'>
            Phone number
            <span className='font-normal text-text-muted'>(optional)</span>
          </Label>
          <Input id='label-optional' type='tel' placeholder='+1 (555) 000-0000' />
        </Field>
        <Field>
          <Label htmlFor='label-tooltip' className='gap-1'>
            API key
            <Tooltip>
              <TooltipTrigger className='inline-flex cursor-help items-center text-text-muted' aria-label='Where to find your API key'>
                <RegistryIcon lucide='InfoIcon' className='size-3.5' />
              </TooltipTrigger>
              <TooltipContent>Find it in the developer settings.</TooltipContent>
            </Tooltip>
          </Label>
          <Input id='label-tooltip' placeholder='sk_live_...' className='font-mono' />
        </Field>
        <Field>
          <Label htmlFor='label-badge' className='gap-2'>
            Webhook URL
            <Badge variant='success-light' size='sm'>Active</Badge>
          </Label>
          <Input id='label-badge' type='url' defaultValue='https://api.example.com/hooks' className='font-mono text-xs' />
        </Field>
        <Field>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='label-helper'>Project key</Label>
            <FieldDescription>Used in issue IDs, like GDS-42.</FieldDescription>
          </div>
          <Input id='label-helper' defaultValue='GDS' className='font-mono' />
        </Field>
        <Field>
          <Label htmlFor='label-status' className='gap-1.5'>
            Server status
            <span className='relative flex size-2' aria-hidden='true'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75' />
              <span className='relative inline-flex size-2 rounded-full bg-success' />
            </span>
          </Label>
          <Input id='label-status' defaultValue='Online' disabled />
        </Field>
        <Field className='sm:col-span-2'>
          <Label htmlFor='label-counter' className='justify-between'>
            Bio
            <span className='font-normal tabular-nums text-text-muted'>{bio}/200</span>
          </Label>
          <Textarea
            id='label-counter'
            rows={2}
            placeholder='Tell us about yourself…'
            maxLength={200}
            onChange={(e) => setBio(e.target.value.length)}
          />
        </Field>
        <Field orientation='horizontal' className='sm:col-span-2'>
          <Checkbox id='label-terms' />
          <Label htmlFor='label-terms'>Accept terms and conditions</Label>
        </Field>
      </div>
    </TooltipProvider>
  );
}

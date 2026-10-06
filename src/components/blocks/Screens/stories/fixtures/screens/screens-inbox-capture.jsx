'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldSeparator
} from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import {
  NativeSelect,
  NativeSelectOption
} from '@gaudi/design-system/core/Select';
import {
  RadioGroupRoot as RadioGroup,
  RadioGroupItem
} from '@gaudi/design-system/core/RadioGroup';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const mailboxes = [
  ['maya@northwind.io', 'Primary · 120 sends a day', 'Healthy', 'success-light'],
  ['sales@northwind.io', 'Shared · 80 sends a day', 'Warming up', 'warning-light'],
  ['maya@northwind.co', 'Reconnect to keep sending', 'Disconnected', 'destructive-light']
];
const recordingModes = [
  ['always', 'Every meeting', 'Join and record all calendar meetings.'],
  ['ask', 'Ask each time', 'Prompt before a meeting starts.'],
  ['never', 'Only when I start it', 'Record manually from the toolbar.']
];
const outputs = [
  ['summary', 'Summary', true],
  ['actions', 'Action items', true],
  ['transcript', 'Full transcript', false],
  ['crm', 'Sync notes to CRM', false]
];

function Toggle({ id, label, description, defaultChecked, checked, onCheckedChange }) {
  return (
    <Field orientation='horizontal'>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <Switch id={id} defaultChecked={defaultChecked} checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
  );
}

export function Pattern() {
  const [consent, setConsent] = useState(true);
  return (
    <div className='grid w-full max-w-5xl items-start gap-4 lg:grid-cols-2'>
      <section aria-labelledby='inbox-title' className='grid gap-4 rounded-xl border p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='grid gap-1'>
            <h2 id='inbox-title' className='text-lg font-semibold'>Outreach inbox</h2>
            <p className='text-text-muted text-sm'>Mailboxes that send your sequences.</p>
          </div>
          <Button size='sm' variant='outline'>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            Connect
          </Button>
        </div>
        <ul className='grid gap-2'>
          {mailboxes.map(([address, detail, state, variant]) => (
            <li key={address} className='flex items-center gap-3 rounded-lg border p-3'>
              <RegistryIcon lucide='InboxIcon' aria-hidden='true' className='text-text-muted size-4' />
              <span className='grid min-w-0 flex-1 text-sm'>
                <span className='truncate font-medium'>{address}</span>
                <span className='text-text-muted text-xs'>{detail}</span>
              </span>
              <Badge size='sm' variant={variant}>{state}</Badge>
            </li>
          ))}
        </ul>
        <FieldGroup className='gap-4'>
          <Field>
            <FieldLabel htmlFor='reply-routing'>Route replies to</FieldLabel>
            <NativeSelect id='reply-routing' defaultValue='owner' className='w-full'>
              <NativeSelectOption value='owner'>The sequence owner</NativeSelectOption>
              <NativeSelectOption value='round'>Round robin across the team</NativeSelectOption>
              <NativeSelectOption value='inbox'>A shared inbox</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Toggle id='signature' label='Append my signature' description='Added below every outgoing email.' defaultChecked />
          <Toggle id='unsubscribe' label='Include an unsubscribe link' description='Required for marketing email in the EU.' defaultChecked />
        </FieldGroup>
      </section>
      <section aria-labelledby='capture-title' className='grid gap-4 rounded-xl border p-5'>
        <div className='grid gap-1'>
          <h2 id='capture-title' className='flex items-center gap-2 text-lg font-semibold'>
            Meeting capture
            <Badge size='sm' variant='info-light'>Beta</Badge>
          </h2>
          <p className='text-text-muted text-sm'>Record calls and turn them into notes.</p>
        </div>
        <fieldset className='@container grid gap-2'>
          <legend className='mb-2 text-sm font-medium'>Recording</legend>
          <RadioGroup defaultValue='ask' className='gap-2 @md:grid-cols-3'>
            {recordingModes.map(([value, label, description]) => (
              <Label key={value} htmlFor={`mode-${value}`} className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal has-data-[state=checked]:border-accent has-data-[state=checked]:bg-accent-subtle'>
                <RadioGroupItem id={`mode-${value}`} value={value} className='mt-0.5' />
                <span className='grid gap-0.5'>
                  <span className='font-medium'>{label}</span>
                  <span className='text-text-muted text-xs'>{description}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
        <FieldSeparator />
        <Toggle id='consent' label='Announce the recording' description='Post a consent message when the bot joins.' checked={consent} onCheckedChange={setConsent} />
        {consent ? (
          <Field>
            <FieldLabel htmlFor='consent-message'>Consent message</FieldLabel>
            <Textarea id='consent-message' rows={2} defaultValue='This call is recorded to take notes. Say “stop recording” at any time.' />
          </Field>
        ) : null}
        <Field>
          <FieldLabel htmlFor='notes-template'>Notes template</FieldLabel>
          <NativeSelect id='notes-template' defaultValue='sales' className='w-full'>
            <NativeSelectOption value='sales'>Sales discovery</NativeSelectOption>
            <NativeSelectOption value='standup'>Team stand-up</NativeSelectOption>
            <NativeSelectOption value='interview'>Candidate interview</NativeSelectOption>
          </NativeSelect>
        </Field>
        <fieldset className='grid gap-2'>
          <legend className='mb-2 text-sm font-medium'>After each meeting</legend>
          <div className='grid gap-2 sm:grid-cols-2'>
            {outputs.map(([id, label, on]) => (
              <div key={id} className='flex items-center justify-between gap-3 rounded-lg border px-3 py-2'>
                <Label htmlFor={`output-${id}`} className='font-normal'>{label}</Label>
                <Switch id={`output-${id}`} size='sm' defaultChecked={on} />
              </div>
            ))}
          </div>
        </fieldset>
      </section>
    </div>
  );
}

'use client';
import { CardRoot } from '@gaudi/design-system/core/Card';
import { Item } from '@gaudi/design-system/core/Item';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';

import {
  FieldLegend,
  FieldSet,
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
import RadioGroup from '@gaudi/design-system/core/RadioGroup';
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
      <CardRoot as='section' variant='outline' padding='none' aria-labelledby='inbox-title' className='grid gap-4 p-5 overflow-visible'>
        <div className='flex items-start justify-between gap-3'>
          <div className='grid gap-1'>
            <h2 id='inbox-title' className='text-lg font-semibold'>Outreach inbox</h2>
            <p className='text-text-muted text-sm'>Mailboxes that send your sequences.</p>
          </div>
        </div>
        <ul className='grid gap-2'>
          {mailboxes.map(([address, detail, state, variant]) => (
            <Item as='li' size='sm' variant='outline' key={address} className='gap-3 p-3'>
              <RegistryIcon lucide='InboxIcon' aria-hidden='true' className='text-text-muted size-4' />
              <span className='grid min-w-0 flex-1 text-sm'>
                <span className='truncate font-medium'>{address}</span>
                <span className='text-text-muted text-xs'>{detail}</span>
              </span>
              <Badge size='sm' variant={variant}>{state}</Badge>
            </Item>
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
      </CardRoot>
      <CardRoot as='section' variant='outline' padding='none' aria-labelledby='capture-title' className='grid gap-4 p-5 overflow-visible'>
        <div className='grid gap-1'>
          <h2 id='capture-title' className='flex items-center gap-2 text-lg font-semibold'>
            Meeting capture
            <Badge size='sm' variant='info-light'>Beta</Badge>
          </h2>
          <p className='text-text-muted text-sm'>Record calls and turn them into notes.</p>
        </div>
        <RadioGroup
          label='Recording'
          defaultValue='ask'
          variant='cards'
          options={recordingModes.map(([value, label, description]) => ({ value, label, description }))}
        />
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
        <FieldSet className='grid gap-2'>
          <FieldLegend className='mb-2 text-sm font-medium'>After each meeting</FieldLegend>
          <div className='grid gap-2 sm:grid-cols-2'>
            {outputs.map(([id, label, on]) => (
              <Item size='sm' variant='outline' key={id} className='justify-between gap-3 px-3 py-2'>
                <Label htmlFor={`output-${id}`} className='font-normal'>{label}</Label>
                <Switch id={`output-${id}`} size='sm' defaultChecked={on} />
              </Item>
            ))}
          </div>
        </FieldSet>
      </CardRoot>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useFileUpload } from '../../../../src/components/core/FileUpload/use-file-upload.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// Grouped sections, each a panel that swaps in beside the navigation.
const groups = [
  { label: 'Account', items: [['profile', 'Profile', 'UserIcon'], ['security', 'Security', 'ShieldCheckIcon'], ['notifications', 'Notifications', 'BellIcon']] },
  { label: 'Workspace', items: [['general', 'General', 'SettingsIcon'], ['team', 'Team', 'UsersIcon'], ['billing', 'Billing', 'CreditCardIcon']] }
];
const members = [
  ['Maya Lopez', 'women/65', 'maya@gaudi.dev', 'Owner'],
  ['Omar Haddad', 'men/41', 'omar@gaudi.dev', 'Admin'],
  ['Priya Nair', 'women/23', 'priya@gaudi.dev', 'Member']
];

function Row({ id, label, description, children }) {
  return (
    <Field orientation='horizontal'>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      {children}
    </Field>
  );
}

function ProfilePanel() {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({ accept: 'image/*', maxSize: 2 * 1024 * 1024 });
  const avatar = files[0]?.preview || '/avatars/women/65.jpg';
  return (
    <FieldGroup className='gap-5'>
      <div className='flex items-center gap-4'>
        <Avatar className='size-14'>
          <AvatarImage src={avatar} alt='Maya Lopez' />
          <AvatarFallback>ML</AvatarFallback>
        </Avatar>
        <div className='grid gap-1'>
          <div className='flex gap-2'>
            <Button size='sm' variant='outline' onClick={openFileDialog}>
              <RegistryIcon lucide='UploadIcon' aria-hidden='true' />
              Upload photo
            </Button>
            <input {...getInputProps()} className='sr-only' aria-label='Profile photo' />
          </div>
          <p className='text-text-muted text-xs'>PNG or JPG, up to 2 MB.</p>
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='shell-name'>Full name</FieldLabel>
          <Input id='shell-name' defaultValue='Maya Lopez' />
        </Field>
        <Field>
          <FieldLabel htmlFor='shell-email'>Email</FieldLabel>
          <InputGroup>
            <InputGroupInput id='shell-email' type='email' defaultValue='maya@gaudi.dev' />
            <InputGroupAddon align='inline-end'>
              <Badge variant='success-light' size='sm'>
                <RegistryIcon lucide='CheckIcon' aria-hidden='true' className='size-3' />
                Verified
              </Badge>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor='shell-language'>Language</FieldLabel>
          <NativeSelect id='shell-language' defaultValue='en-GB' className='w-full'>
            <NativeSelectOption value='en-GB'>English (UK)</NativeSelectOption>
            <NativeSelectOption value='de'>Deutsch</NativeSelectOption>
            <NativeSelectOption value='fr'>Français</NativeSelectOption>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor='shell-timezone'>Time zone</FieldLabel>
          <NativeSelect id='shell-timezone' defaultValue='berlin' className='w-full'>
            <NativeSelectOption value='london'>(GMT+0) London</NativeSelectOption>
            <NativeSelectOption value='berlin'>(GMT+1) Berlin</NativeSelectOption>
            <NativeSelectOption value='dubai'>(GMT+4) Dubai</NativeSelectOption>
          </NativeSelect>
        </Field>
      </div>
      <div className='flex justify-end gap-2'>
        <Button variant='outline'>Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </FieldGroup>
  );
}

const panels = {
  profile: { title: 'Profile', description: 'How you appear to teammates and in shared documents.', body: <ProfilePanel /> },
  security: {
    title: 'Security',
    description: 'Protect your account and review where you are signed in.',
    body: (
      <FieldGroup className='gap-4'>
        <Row id='shell-2fa' label='Two-factor authentication' description='Ask for a code from your authenticator app at sign-in.'>
          <Switch id='shell-2fa' defaultChecked />
        </Row>
        <Row id='shell-password' label='Password' description='Last changed 3 months ago.'>
          <Button id='shell-password' size='sm' variant='outline'>Change</Button>
        </Row>
        <Separator />
        <ul className='grid gap-2 text-sm'>
          {[['MacBook Pro · Berlin', 'This device'], ['iPhone 15 · Berlin', '2 hours ago']].map(([device, seen]) => (
            <li key={device} className='flex items-center gap-3'>
              <RegistryIcon lucide={device.startsWith('iPhone') ? 'SmartphoneIcon' : 'MonitorIcon'} aria-hidden='true' className='text-text-muted size-4' />
              <span className='flex-1'>{device}</span>
              <span className='text-text-muted text-xs'>{seen}</span>
            </li>
          ))}
        </ul>
      </FieldGroup>
    )
  },
  notifications: {
    title: 'Notifications',
    description: 'Choose what reaches your inbox.',
    body: (
      <FieldGroup className='gap-4'>
        <Row id='shell-mentions' label='Mentions and replies' description='When someone mentions you or replies to your comment.'>
          <Switch id='shell-mentions' defaultChecked />
        </Row>
        <Row id='shell-digest' label='Weekly digest' description='A Monday summary of activity in your workspace.'>
          <Switch id='shell-digest' />
        </Row>
      </FieldGroup>
    )
  },
  general: {
    title: 'General',
    description: 'Workspace name, address and defaults.',
    body: (
      <FieldGroup className='gap-4'>
        <Field>
          <FieldLabel htmlFor='shell-workspace'>Workspace name</FieldLabel>
          <Input id='shell-workspace' defaultValue='Gaudi' />
        </Field>
        <Field>
          <FieldLabel htmlFor='shell-url'>Workspace URL</FieldLabel>
          <Input id='shell-url' defaultValue='northwind.gaudi.app' />
          <FieldDescription>Changing the address breaks existing links.</FieldDescription>
        </Field>
      </FieldGroup>
    )
  },
  team: {
    title: 'Team',
    description: '3 of 10 seats in use.',
    body: (
      <ul className='grid gap-3'>
        {members.map(([name, portrait, email, role]) => (
          <li key={name} className='flex items-center gap-3'>
            <Avatar className='size-8'>
              <AvatarImage src={`/avatars/${portrait}.jpg`} alt={name} />
              <AvatarFallback>{name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className='grid min-w-0 flex-1 text-sm'>
              <span className='font-medium'>{name}</span>
              <span className='text-text-muted truncate text-xs'>{email}</span>
            </span>
            <Badge variant={role === 'Owner' ? 'primary-light' : 'outline'} size='sm'>{role}</Badge>
          </li>
        ))}
      </ul>
    )
  },
  billing: {
    title: 'Billing',
    description: 'Team plan · €48 per month, renews 14 November.',
    body: (
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4'>
        <span className='grid text-sm'>
          <span className='font-medium'>Team · monthly</span>
          <span className='text-text-muted text-xs'>Visa ending 4242</span>
        </span>
        <Button size='sm' variant='outline'>Manage plan</Button>
      </div>
    )
  }
};

export function Pattern() {
  const [active, setActive] = useState('profile');
  const panel = panels[active];
  return (
    <div className='bg-surface grid w-full max-w-4xl overflow-hidden rounded-xl border md:grid-cols-[13rem_minmax(0,1fr)]'>
      <nav aria-label='Settings' className='bg-surface-muted grid content-start gap-3 border-b p-3 md:border-e md:border-b-0'>
        {groups.map((group) => (
          <Collapsible key={group.label} defaultOpen>
            <CollapsibleTrigger className='text-text-muted group flex w-full cursor-pointer items-center justify-between px-2 py-1 text-xs font-medium'>
              {group.label}
              <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' className='size-3.5 transition-transform group-data-[state=closed]:-rotate-90' />
            </CollapsibleTrigger>
            <CollapsibleContent className='grid gap-0.5 pt-1'>
              {group.items.map(([key, label, icon]) => (
                <Button
                  key={key}
                  variant='ghost'
                  size='sm'
                  aria-current={active === key ? 'page' : undefined}
                  onClick={() => setActive(key)}
                  className={cn('justify-start', active === key && 'bg-surface text-text shadow-xs')}
                >
                  <RegistryIcon lucide={icon} aria-hidden='true' />
                  {label}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
      <section aria-labelledby='shell-panel-title' className='grid content-start gap-5 p-5 sm:p-6'>
        <header className='grid gap-1'>
          <h2 id='shell-panel-title' className='text-lg font-semibold'>{panel.title}</h2>
          <p className='text-text-muted text-sm'>{panel.description}</p>
        </header>
        {panel.body}
      </section>
    </div>
  );
}

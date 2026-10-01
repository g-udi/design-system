'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const organisations = [
  { id: 'northwind', name: 'Gaudi', members: 48, role: 'admin' },
  { id: 'fieldnotes', name: 'Field Notes Press', members: 6, role: 'editor' }
];
const audit = [
  { id: 1, text: 'Signed in from Firefox on macOS', when: 'Today, 09:12' },
  { id: 2, text: 'Changed the display name', when: 'Yesterday, 17:40' },
  { id: 3, text: 'Joined Field Notes Press', when: 'Sep 28' }
];
// 12 weeks of daily activity, oldest first; values are edits per day.
const activity = Array.from({ length: 84 }, (_, day) => [0, 1, 3, 0, 5, 2, 8, 0, 1, 4, 6, 0, 2, 9][(day * 7 + (day % 5)) % 14]);
const level = (count) => (count === 0 ? 'bg-surface-muted' : count < 3 ? 'bg-accent/25' : count < 6 ? 'bg-accent/55' : 'bg-accent');

const passwordRules = {
  current: validators.required('Enter your current password.'),
  next: [validators.required('Enter a new password.'), validators.minLength(12, 'Use at least 12 characters.')],
  confirm: [validators.required('Repeat the new password.'), (value, values) => (value && value !== values.next ? 'The passwords do not match.' : '')]
};

function Heatmap() {
  const total = activity.reduce((sum, count) => sum + count, 0);
  const active = activity.filter(Boolean).length;
  return (
    <figure className='grid gap-2'>
      <figcaption className='flex justify-between text-xs'>
        <span className='font-medium'>Activity</span>
        <span className='text-text-muted'>{total} edits in 12 weeks</span>
      </figcaption>
      <div role='img' aria-label={`${total} edits over the last 12 weeks, active on ${active} of 84 days`} className='grid grid-flow-col grid-rows-7 gap-0.5'>
        {activity.map((count, day) => (
          <span key={day} className={cn('aspect-square rounded-xs', level(count))} />
        ))}
      </div>
      <div aria-hidden='true' className='text-text-muted flex items-center justify-end gap-1 text-xs'>
        Less
        {[0, 2, 4, 8].map((count) => <span key={count} className={cn('size-2.5 rounded-xs', level(count))} />)}
        More
      </div>
    </figure>
  );
}

export function Pattern() {
  const profile = useFormValidation({ initialValues: { name: 'Maya Chen', email: 'maya@gaudi.dev', language: 'en-GB' }, rules: { name: validators.required('Enter your name.'), email: [validators.required('Enter your email.'), validators.email()] } });
  const password = useFormValidation({ initialValues: { current: '', next: '', confirm: '' }, rules: passwordRules });
  const [roles, setRoles] = useState(Object.fromEntries(organisations.map((org) => [org.id, org.role])));
  const [twoFactor, setTwoFactor] = useState(true);
  const [notice, setNotice] = useState('');

  return (
    <div className='mx-auto grid w-full max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]'>
      <Tabs defaultValue='profile' className='min-w-0 gap-4'>
        <TabsList aria-label='Account sections' variant='line'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='organisations'>Organisations</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <form noValidate aria-label='Profile' onSubmit={profile.handleSubmit(() => setNotice('Profile saved.'))} className='grid gap-4 rounded-lg border p-5'>
            <FieldGroup className='gap-4'>
              <Field data-invalid={profile.errors.name ? true : undefined}>
                <FieldLabel htmlFor={profile.id('name')}>Full name</FieldLabel>
                <Input {...profile.field('name')} autoComplete='name' />
                <FieldError id={profile.errorId('name')}>{profile.errors.name}</FieldError>
              </Field>
              <Field data-invalid={profile.errors.email ? true : undefined}>
                <FieldLabel htmlFor={profile.id('email')}>Email</FieldLabel>
                <Input {...profile.field('email')} type='email' autoComplete='email' suffix={<Badge size='sm' variant='success-light'>Verified</Badge>} />
                <FieldDescription>Changing it sends a confirmation link to the new address.</FieldDescription>
                <FieldError id={profile.errorId('email')}>{profile.errors.email}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor={profile.id('language')}>Language</FieldLabel>
                <Select value={profile.values.language} onValueChange={(language) => profile.setValue('language', language)}>
                  <SelectTrigger id={profile.id('language')} className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='en-GB'>English (UK)</SelectItem>
                    <SelectItem value='en-US'>English (US)</SelectItem>
                    <SelectItem value='de'>Deutsch</SelectItem>
                    <SelectItem value='nl'>Nederlands</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <Button type='submit' className='justify-self-end'>Save profile</Button>
          </form>
        </TabsContent>
        <TabsContent value='organisations'>
          <ul aria-label='Organisations' className='divide-y rounded-lg border'>
            {organisations.map((org) => (
              <li key={org.id} className='flex flex-wrap items-center gap-3 p-4'>
                <span className='bg-surface-muted grid size-9 place-items-center rounded-md text-sm font-semibold'>{org.name[0]}</span>
                <span className='grid min-w-0 flex-1 basis-40'>
                  <span className='truncate text-sm font-medium'>{org.name}</span>
                  <span className='text-text-muted text-xs'>{org.members} members</span>
                </span>
                <Select value={roles[org.id]} onValueChange={(role) => setRoles((current) => ({ ...current, [org.id]: role }))}>
                  <SelectTrigger aria-label={`Your role in ${org.name}`} className='w-32'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='admin'>Admin</SelectItem>
                    <SelectItem value='editor'>Editor</SelectItem>
                    <SelectItem value='viewer'>Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button size='sm' variant='ghost' tone='danger' onClick={() => setNotice(`You left ${org.name}.`)}>Leave</Button>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value='security' className='grid gap-4'>
          <div className='flex items-start justify-between gap-4 rounded-lg border p-4'>
            <div className='grid gap-0.5'>
              <label htmlFor='profile-two-factor' className='text-sm font-medium'>Two-step verification</label>
              <p className='text-text-muted text-sm'>Ask for a code from your authenticator app when signing in.</p>
            </div>
            <Switch id='profile-two-factor' checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <form
            noValidate
            aria-labelledby='profile-password-title'
            onSubmit={password.handleSubmit(() => {
              setNotice('Password changed. Other sessions were signed out.');
              password.reset();
            })}
            className='grid gap-4 rounded-lg border p-5'
          >
            <h3 id='profile-password-title' className='text-sm font-semibold'>Change password</h3>
            {[
              ['current', 'Current password', 'current-password'],
              ['next', 'New password', 'new-password'],
              ['confirm', 'Repeat new password', 'new-password']
            ].map(([name, label, autoComplete]) => (
              <Field key={name} data-invalid={password.errors[name] ? true : undefined}>
                <FieldLabel htmlFor={password.id(name)}>{label}</FieldLabel>
                <Input {...password.field(name)} type='password' autoComplete={autoComplete} />
                <FieldError id={password.errorId(name)}>{password.errors[name]}</FieldError>
              </Field>
            ))}
            <Button type='submit' className='justify-self-end'>Update password</Button>
          </form>
        </TabsContent>
        <p role='status' className='text-text-muted min-h-5 text-sm'>{notice}</p>
      </Tabs>
      <aside aria-label='Account summary' className='grid gap-4 rounded-lg border p-4 lg:sticky lg:top-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='size-10'>
            <AvatarImage src='https://randomuser.me/api/portraits/women/44.jpg' alt='' />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <div className='grid min-w-0'>
            <span className='truncate text-sm font-medium'>{profile.values.name}</span>
            <span className='text-text-muted truncate text-xs'>{profile.values.email}</span>
          </div>
        </div>
        <dl className='grid grid-cols-2 gap-2 text-xs'>
          <dt className='text-text-muted'>Member since</dt>
          <dd className='text-end'>Mar 2024</dd>
          <dt className='text-text-muted'>Two-step</dt>
          <dd className='text-end'>{twoFactor ? 'On' : 'Off'}</dd>
          <dt className='text-text-muted'>Sessions</dt>
          <dd className='text-end'>3 active</dd>
        </dl>
        <Heatmap />
        <div className='grid gap-2'>
          <h3 className='text-xs font-medium'>Recent activity</h3>
          <ol className='grid gap-2'>
            {audit.map((entry) => (
              <li key={entry.id} className='flex gap-2 text-xs'>
                <RegistryIcon lucide='HistoryIcon' aria-hidden='true' className='text-text-muted mt-0.5 size-3.5 shrink-0' />
                <span className='grid'>
                  {entry.text}
                  <span className='text-text-muted'>{entry.when}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

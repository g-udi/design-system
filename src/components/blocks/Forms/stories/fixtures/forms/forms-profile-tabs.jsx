'use client';
import { Item } from '@gaudi/design-system/core/Item';
import { CardTitle, CardRoot } from '@gaudi/design-system/core/Card';
import { useState } from 'react';
import Avatar from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Label, FieldRoot as Field, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { HeatmapChart } from '@gaudi/design-system/charts/HeatmapChart';
import Timeline from '@gaudi/design-system/core/Timeline';
import { EmailInput } from '@gaudi/design-system/core/Input';

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
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const activityCells = activity.map((value, day) => ({ x: String(Math.floor(day / 7) + 1), y: weekdays[day % 7], value }));
const totalEdits = activity.reduce((sum, value) => sum + value, 0);
const activeDays = activity.filter(Boolean).length;

const passwordRules = {
  current: validators.required('Enter your current password.'),
  next: [validators.required('Enter a new password.'), validators.minLength(12, 'Use at least 12 characters.')],
  confirm: [validators.required('Repeat the new password.'), (value, values) => (value && value !== values.next ? 'The passwords do not match.' : '')]
};

export function Pattern() {
  const profile = useFormValidation({ initialValues: { name: 'Mei Castellanos', email: 'mei@gaudi.dev', language: 'en-GB' }, rules: { name: validators.required('Enter your name.'), email: [validators.required('Enter your email.'), validators.email()] } });
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
          <CardRoot as='form' variant='outline' radius='lg' padding='none' noValidate aria-label='Profile' onSubmit={profile.handleSubmit(() => setNotice('Profile saved.'))} className='grid gap-4 p-5'>
            <FieldGroup className='gap-4'>
              <Field data-invalid={profile.errors.name ? true : undefined}>
                <FieldLabel htmlFor={profile.id('name')}>Full name</FieldLabel>
                <Input {...profile.field('name')} autoComplete='name' />
                <FieldError id={profile.errorId('name')}>{profile.errors.name}</FieldError>
              </Field>
              <Field data-invalid={profile.errors.email ? true : undefined}>
                <FieldLabel htmlFor={profile.id('email')}>Email</FieldLabel>
                <EmailInput {...profile.field('email')}  autoComplete='email' suffix={<Badge size='sm' variant='success-light'>Verified</Badge>} />
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
          </CardRoot>
        </TabsContent>
        <TabsContent value='organisations'>
          <ul aria-label='Organisations' className='divide-y rounded-lg border'>
            {organisations.map((org) => (
              <Item as='li' size='sm' key={org.id} className='rounded-none flex flex-wrap items-center gap-3 p-4'>
                <Avatar aria-hidden='true' shape='square' size='sm' name={org.name} label={org.name[0]} surface='tinted' />
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
              </Item>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value='security' className='grid gap-4'>
          <CardRoot variant='outline' radius='lg' padding='none' className='flex items-start justify-between gap-4 p-4'>
            <div className='grid gap-0.5'>
              <Label htmlFor='profile-two-factor' className='text-sm font-medium'>Two-step verification</Label>
              <p className='text-text-muted text-sm'>Ask for a code from your authenticator app when signing in.</p>
            </div>
            <Switch id='profile-two-factor' checked={twoFactor} onCheckedChange={setTwoFactor} />
          </CardRoot>
          <CardRoot as='form' variant='outline' radius='lg' padding='none'
            noValidate
            aria-labelledby='profile-password-title'
            onSubmit={password.handleSubmit(() => {
              setNotice('Password changed. Other sessions were signed out.');
              password.reset();
            })}
            className='grid gap-4 p-5'
          >
            <CardTitle as='h3' id='profile-password-title' className='text-sm font-semibold'>Change password</CardTitle>
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
          </CardRoot>
        </TabsContent>
        <p role='status' className='text-text-muted min-h-5 text-sm'>{notice}</p>
      </Tabs>
      <CardRoot as='aside' variant='outline' radius='lg' padding='none' aria-label='Account summary' className='grid gap-4 p-4 lg:sticky lg:top-4'>
        <div className='flex items-center gap-3'>
          <Avatar name={profile.values.name} src='/avatars/person-20.svg' alt='' size='lg' />
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
        <HeatmapChart
          title='Activity'
          description={`${totalEdits} edits in 12 weeks`}
          ariaLabel={`${totalEdits} edits over the last 12 weeks, active on ${activeDays} of 84 days`}
          data={activityCells} yLabels={weekdays} valueLabel='Edits'
          framed={false} showValues={false}
        />
        <div className='grid gap-2'>
          <h3 className='text-xs font-medium'>Recent activity</h3>
          <Timeline label='Recent activity' items={audit.map((entry) => ({ id: entry.id, title: entry.text, time: entry.when }))} />
        </div>
      </CardRoot>
    </div>
  );
}

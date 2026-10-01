'use client';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '../../../../src/components/core/NumberField/parts/number-field-extended.jsx';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { useFormValidation } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const initialValues = {
  emailEnabled: true,
  magicLinks: false,
  verify: 'new-device',
  domains: 'northwind.dev, northwind.co.uk',
  phoneEnabled: true,
  channel: 'sms',
  country: 'GB',
  minLength: 12,
  require: ['number', 'symbol'],
  expiry: 'never',
  passkeys: 'admins',
  attempts: 5,
  lockFor: '15',
  notify: true
};
const domainList = (value) => String(value).split(',').map((domain) => domain.trim()).filter(Boolean);
const rules = {
  domains: (value, values) =>
    values.emailEnabled && domainList(value).some((domain) => !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain)) ? 'Use domains like example.com, separated by commas.' : '',
  emailEnabled: (value, values) => (!value && !values.phoneEnabled && values.passkeys === 'off' ? 'Keep at least one way to sign in.' : '')
};
const requirements = [
  { id: 'upper', label: 'An uppercase letter' },
  { id: 'number', label: 'A number' },
  { id: 'symbol', label: 'A symbol' }
];

function ToggleRow({ id, label, description, checked, onCheckedChange }) {
  return (
    <Field orientation='horizontal'>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
  );
}

export function Pattern() {
  const form = useFormValidation({ initialValues, rules, validateOn: 'submit' });
  const [saved, setSaved] = useState(initialValues);
  const { values, errors } = form;
  const set = (name) => (value) => form.setValue(name, value);
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const summary = [
    values.emailEnabled && (values.magicLinks ? 'email and magic links' : 'email and password'),
    values.phoneEnabled && `${values.channel === 'sms' ? 'SMS' : 'WhatsApp'} codes`,
    values.passkeys !== 'off' && (values.passkeys === 'all' ? 'passkeys for everyone' : values.passkeys === 'admins' ? 'passkeys for admins' : 'optional passkeys')
  ].filter(Boolean);

  return (
    <form noValidate aria-labelledby='auth-policy-title' onSubmit={form.handleSubmit((data) => setSaved(data))} className='mx-auto grid w-full max-w-3xl gap-4 rounded-lg border p-5 sm:p-6'>
      <div className='grid gap-1'>
        <h2 id='auth-policy-title' className='text-lg font-semibold'>Sign-in policy</h2>
        <p className='text-text-muted text-sm'>Applies to every member of Gaudi. Changes take effect on the next sign-in.</p>
      </div>
      {errors.emailEnabled ? (
        <Alert variant='destructive'>
          <RegistryIcon lucide='CircleAlertIcon' aria-hidden='true' />
          <AlertTitle>Nobody could sign in</AlertTitle>
          <AlertDescription>{errors.emailEnabled}</AlertDescription>
        </Alert>
      ) : null}
      <Tabs defaultValue='email' className='gap-4'>
        <TabsList aria-label='Sign-in methods' variant='line' className='max-w-full overflow-x-auto'>
          <TabsTrigger value='email'>Email</TabsTrigger>
          <TabsTrigger value='phone'>Phone</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
          <TabsTrigger value='passkey'>Passkey</TabsTrigger>
          <TabsTrigger value='lockout'>Lockout</TabsTrigger>
        </TabsList>
        <TabsContent value='email'>
          <FieldGroup className='gap-5'>
            <ToggleRow id={form.id('email-enabled')} label='Email sign-in' description='Members sign in with their work email.' checked={values.emailEnabled} onCheckedChange={set('emailEnabled')} />
            <ToggleRow id={form.id('magic-links')} label='Magic links' description='Send a one-time link instead of asking for a password.' checked={values.magicLinks} onCheckedChange={set('magicLinks')} />
            <RadioGroup
              label='Verify the email address'
              value={values.verify}
              onValueChange={set('verify')}
              disabled={!values.emailEnabled}
              options={[
                { value: 'always', label: 'On every sign-in' },
                { value: 'new-device', label: 'On new devices', description: 'Recommended' },
                { value: 'signup', label: 'Only when the account is created' }
              ]}
            />
            <Field data-invalid={errors.domains ? true : undefined}>
              <FieldLabel htmlFor={form.id('domains')}>Allowed domains</FieldLabel>
              <Input {...form.field('domains', { describedBy: form.id('domains-hint') })} disabled={!values.emailEnabled} />
              <FieldDescription id={form.id('domains-hint')}>Only addresses on these domains can join. Separate with commas.</FieldDescription>
              <FieldError id={form.errorId('domains')}>{errors.domains}</FieldError>
            </Field>
          </FieldGroup>
        </TabsContent>
        <TabsContent value='phone'>
          <FieldGroup className='gap-5'>
            <ToggleRow id={form.id('phone-enabled')} label='Phone codes' description='Text a 6-digit code to a verified number.' checked={values.phoneEnabled} onCheckedChange={set('phoneEnabled')} />
            <RadioGroup
              label='Send codes by'
              variant='cards'
              value={values.channel}
              onValueChange={set('channel')}
              disabled={!values.phoneEnabled}
              options={[
                { value: 'sms', label: 'SMS', description: 'Works on every phone' },
                { value: 'whatsapp', label: 'WhatsApp', description: 'Cheaper abroad, needs the app' }
              ]}
            />
            <Field>
              <FieldLabel htmlFor={form.id('country')}>Default country code</FieldLabel>
              <Select value={values.country} onValueChange={set('country')} disabled={!values.phoneEnabled}>
                <SelectTrigger id={form.id('country')} className='w-full sm:w-64'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='GB'>United Kingdom (+44)</SelectItem>
                  <SelectItem value='DE'>Germany (+49)</SelectItem>
                  <SelectItem value='US'>United States (+1)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </TabsContent>
        <TabsContent value='password'>
          <FieldGroup className='gap-5'>
            <Field>
              <div className='flex items-baseline justify-between'>
                <FieldLabel id={form.id('length-label')}>Minimum length</FieldLabel>
                <span className='text-sm tabular-nums'>{values.minLength} characters</span>
              </div>
              <Slider min={8} max={32} step={1} value={[values.minLength]} onValueChange={([length]) => form.setValue('minLength', length)} aria-label='Minimum length' />
              <FieldDescription>{values.minLength < 12 ? 'Below 12 characters is easier to guess.' : 'Long passwords are the strongest single defence.'}</FieldDescription>
            </Field>
            <FieldSet>
              <FieldLegend variant='label'>Must include</FieldLegend>
              <div className='grid gap-2 sm:grid-cols-3'>
                {requirements.map((item) => (
                  <Field key={item.id} orientation='horizontal'>
                    <Checkbox
                      id={form.id(`require-${item.id}`)}
                      checked={values.require.includes(item.id)}
                      onCheckedChange={(on) => form.setValue('require', on ? [...values.require, item.id] : values.require.filter((id) => id !== item.id))}
                    />
                    <FieldLabel htmlFor={form.id(`require-${item.id}`)} className='font-normal'>{item.label}</FieldLabel>
                  </Field>
                ))}
              </div>
            </FieldSet>
            <Field>
              <FieldLabel htmlFor={form.id('expiry')}>Ask for a new password</FieldLabel>
              <Select value={values.expiry} onValueChange={set('expiry')}>
                <SelectTrigger id={form.id('expiry')} className='w-full sm:w-64'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='never'>Never (recommended)</SelectItem>
                  <SelectItem value='180'>Every 6 months</SelectItem>
                  <SelectItem value='90'>Every 3 months</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </TabsContent>
        <TabsContent value='passkey'>
          <RadioGroup
            label='Passkeys'
            description='Passkeys use the device lock screen and cannot be phished.'
            variant='cards'
            value={values.passkeys}
            onValueChange={set('passkeys')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'optional', label: 'Optional', description: 'Members choose' },
              { value: 'admins', label: 'Required for admins', description: '6 admins affected' },
              { value: 'all', label: 'Required for everyone', description: '48 members affected' }
            ]}
          />
        </TabsContent>
        <TabsContent value='lockout'>
          <FieldGroup className='gap-5'>
            <NumberField value={values.attempts} min={3} max={20} onValueChange={(attempts) => form.setValue('attempts', attempts ?? 3)} className='max-w-48'>
              <NumberFieldScrubArea label='Failed attempts before lockout' />
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
            <Field>
              <FieldLabel htmlFor={form.id('lock-for')}>Lock the account for</FieldLabel>
              <Select value={values.lockFor} onValueChange={set('lockFor')}>
                <SelectTrigger id={form.id('lock-for')} className='w-full sm:w-64'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='5'>5 minutes</SelectItem>
                  <SelectItem value='15'>15 minutes</SelectItem>
                  <SelectItem value='60'>1 hour</SelectItem>
                  <SelectItem value='admin'>Until an admin unlocks it</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <ToggleRow id={form.id('notify')} label='Email admins on lockout' description='Includes the device, location and time of each attempt.' checked={values.notify} onCheckedChange={set('notify')} />
          </FieldGroup>
        </TabsContent>
      </Tabs>
      <div className='flex flex-wrap items-center gap-3 border-t pt-4'>
        <p className='text-text-muted min-w-0 flex-1 basis-60 text-sm'>
          Members can sign in with {summary.length ? summary.join(', ') : 'no method'}. Locked for {values.lockFor === 'admin' ? 'admin review' : `${values.lockFor} minutes`} after {values.attempts} failed attempts.
        </p>
        <Button type='button' variant='ghost' tone='neutral' disabled={!dirty} onClick={() => form.reset(saved)}>Discard</Button>
        <Button type='submit' disabled={!dirty}>Save policy</Button>
      </div>
    </form>
  );
}

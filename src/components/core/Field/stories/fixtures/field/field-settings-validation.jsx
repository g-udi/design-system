'use client';
import { useId, useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldErrorPrimitive as FieldError,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldSeparator,
  FieldTitle
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
export function Pattern() {
  const id = useId();
  const [slug, setSlug] = useState('alex johnson');
  const [bio, setBio] = useState('Writes about type, colour and slow software.');
  const [status, setStatus] = useState('');
  const slugInvalid = !/^[a-z0-9-]+$/.test(slug);
  return (
    <form className='mx-auto w-full max-w-xs' onSubmit={(event) => { event.preventDefault(); setStatus(slugInvalid ? 'Correct the URL slug before saving.' : 'Changes saved in this demo.'); }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='settings-name'>
            Display Name <span className='text-danger'>*</span>
          </FieldLabel>
          <Input id='settings-name' defaultValue='Anouk Varga' required />
          <FieldDescription>Shown on your posts and author page.</FieldDescription>
        </Field>
        <Field data-invalid={slugInvalid || undefined}>
          <FieldLabel htmlFor='settings-slug'>URL Slug</FieldLabel>
          <Input id='settings-slug' value={slug} onChange={(event) => { setSlug(event.target.value); setStatus(''); }} aria-invalid={slugInvalid || undefined} aria-describedby={slugInvalid ? `${id}-slug-error` : undefined} />
          {slugInvalid ? <FieldError id={`${id}-slug-error`}>
            Slug can only contain lowercase letters, numbers, and hyphens.
          </FieldError> : null}
        </Field>
        <Field>
          <div className='flex items-center justify-between'>
            <FieldLabel htmlFor='settings-bio'>Bio</FieldLabel>
            <span className='text-text-muted text-xs'>{bio.length}/160</span>
          </div>
          <Textarea
            id='settings-bio'
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={160}
            className='min-h-[80px]'
          />
          <FieldDescription>
            Brief description for your profile.
          </FieldDescription>
        </Field>
        <FieldSeparator />
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle>Email Notifications</FieldTitle>
            <FieldDescription>
              Receive emails about account activity.
            </FieldDescription>
          </FieldContent>
          <Switch
            aria-label='Email Notifications'
            id='settings-email-notif'
            defaultChecked
          />
        </Field>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle>Marketing Emails</FieldTitle>
            <FieldDescription>
              Receive emails about new features and tips.
            </FieldDescription>
          </FieldContent>
          <Switch aria-label='Marketing Emails' id='settings-marketing' />
        </Field>
        <FieldSeparator />
        <Field orientation='horizontal'>
          <Checkbox aria-label='Terms of Service' id='settings-terms' />
          <FieldContent>
            <FieldTitle>Terms of Service</FieldTitle>
            <FieldDescription>
              I agree to the <Link href='/terms'>Terms of Service</Link> and{' '}
              <Link href='/privacy'>Privacy Policy</Link>.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Button type='submit' className='w-full'>Save Changes</Button>
        <p role='status' className='text-sm text-text-muted'>{status}</p>
      </FieldGroup>
    </form>
  );
}

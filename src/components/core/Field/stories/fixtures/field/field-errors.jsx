'use client';
import { useId, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldErrorPrimitive as FieldError,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { EmailInput } from '@gaudi/design-system/core/Input';
export function Pattern() {
  const id = useId();
  const [email, setEmail] = useState('invalid-email');
  const [emailInvalid, setEmailInvalid] = useState(true);
  const [password, setPassword] = useState('short');
  const [confirmation, setConfirmation] = useState('');
  const [status, setStatus] = useState('');
  const passwordErrors = [
    password.length < 8 && { message: 'Must be at least 8 characters.' },
    !/[0-9]/.test(password) && { message: 'Must contain at least one number.' }
  ].filter(Boolean);
  const confirmationInvalid = confirmation !== password;
  return (
    <form className='mx-auto w-full max-w-xs' onSubmit={(event) => { event.preventDefault(); setStatus('Account details validated in this demo.'); }}>
      <FieldGroup>
        <Field data-invalid={emailInvalid || undefined}>
          <FieldLabel htmlFor='val-email'>
            Email <span className='text-danger'>*</span>
          </FieldLabel>
          <EmailInput
            id='val-email'
            prefix={<RegistryIcon lucide='MailIcon' aria-hidden='true' />}
            value={email}
            required
            aria-invalid={emailInvalid || undefined}
            aria-describedby={emailInvalid ? `${id}-email-error` : undefined}
            onChange={(event) => { setEmail(event.target.value); setEmailInvalid(!event.target.validity.valid); setStatus(''); }}
            placeholder='you@example.com'
          />
          {emailInvalid ? <FieldError id={`${id}-email-error`}>Please enter a valid email address.</FieldError> : null}
        </Field>
        <Field data-invalid={passwordErrors.length > 0 || undefined}>
          <FieldLabel htmlFor='val-password'>
            Password <span className='text-danger'>*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='LockIcon' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput
              id='val-password'
              type='password'
              value={password}
              required
              aria-invalid={passwordErrors.length > 0 || undefined}
              aria-describedby={passwordErrors.length ? `${id}-password-error` : undefined}
              onChange={(event) => { setPassword(event.target.value); setStatus(''); }}
              placeholder='Enter password'
            />
          </InputGroup>
          <FieldError id={`${id}-password-error`} errors={passwordErrors} />
        </Field>
        <Field>
          <FieldLabel htmlFor='val-confirm'>Confirm Password</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='LockIcon' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput
              id='val-confirm'
              type='password'
              placeholder='Repeat password'
              value={confirmation}
              onChange={(event) => { setConfirmation(event.target.value); setStatus(''); }}
              required
              aria-invalid={confirmation && confirmationInvalid ? true : undefined}
              aria-describedby={`${id}-confirm-help`}
            />
          </InputGroup>
          <FieldDescription id={`${id}-confirm-help`}>
            {confirmation && confirmationInvalid ? 'Passwords must match.' : 'Re-enter your password to confirm.'}
          </FieldDescription>
        </Field>
        <Button type='submit' className='w-full' disabled={emailInvalid || passwordErrors.length > 0 || confirmationInvalid}>Create Account</Button>
        <p role='status' className='text-sm text-text-muted'>{status}</p>
      </FieldGroup>
    </form>
  );
}

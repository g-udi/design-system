'use client';

import { useEffect, useRef, useState } from 'react';
import Field, { FieldLabel, FieldDescription } from '../../core/Field';
import Input from '../../core/Input';
import Button from '../../core/Button';

/** Form layout and pending/error presentation; the host owns authentication. */
export default function AuthForm({
  title = 'Sign in',
  description,
  mode = 'password',
  onSubmit,
  submitLabel = 'Sign in',
  successMessage = 'Check your inbox for the next step.',
  errorMessage = 'Sign-in failed. Check your details and try again.',
  footer,
  emailLabel = 'Email',
  passwordLabel = 'Password'
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const submit = async (event) => {
    event.preventDefault();
    if (busy.current) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    busy.current = true;
    setPending(true);
    setError(false);
    setSuccess(false);
    try {
      await onSubmit(values);
      if (mounted.current) setSuccess(true);
    } catch {
      if (mounted.current) setError(true);
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return (
    <form
      className='ds-auth-form'
      onSubmit={submit}
      aria-label={title}
      aria-busy={pending}
    >
      <header>
        <h2 className='ds-title'>{title}</h2>
        {description && <p className='ds-description'>{description}</p>}
      </header>
      <fieldset disabled={pending} className='ds-stack'>
        <Field>
          <FieldLabel>{emailLabel}</FieldLabel>
          <Input type='email' name='email' autoComplete='email' required />
        </Field>
        {mode === 'password' && (
          <Field>
            <FieldLabel>{passwordLabel}</FieldLabel>
            <Input
              type='password'
              name='password'
              autoComplete='current-password'
              required
            />
            <FieldDescription>
              Use the password for your account.
            </FieldDescription>
          </Field>
        )}
        <Button type='submit' disabled={pending}>
          {pending ? 'Signing in…' : submitLabel}
        </Button>
      </fieldset>
      {error && (
        <p role='alert' className='ds-error'>
          {errorMessage}
        </p>
      )}
      {success && (
        <p role='status' className='ds-description'>
          {successMessage}
        </p>
      )}
      {footer}
    </form>
  );
}

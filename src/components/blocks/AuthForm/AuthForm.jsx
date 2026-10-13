'use client';

import { useId, useRef, useState } from 'react';
import { useIsMounted } from '../../../hooks/environment/use-is-mounted.js';
import Field, { FieldLabel, FieldDescription } from '../../core/Field';
import Input, { EmailInput } from '../../core/Input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../../core/Input/InputGroup.jsx';
import Button from '../../core/Button';
import Icon from '../../core/Icon';

// The reveal button swaps the input type; the value and autofill stay with the same field. The input sits in an
// InputGroup, so it takes its id and description explicitly instead of from the Field context.
function PasswordInput({ id, describedBy, autoComplete, minLength, placeholder, showLabel, hideLabel }) {
  const [visible, setVisible] = useState(false);
  return (
    <InputGroup>
      <InputGroupInput id={id} aria-describedby={describedBy} type={visible ? 'text' : 'password'} name='password' autoComplete={autoComplete} minLength={minLength} placeholder={placeholder} required />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton size='icon-xs' aria-label={visible ? hideLabel : showLabel} aria-pressed={visible} onClick={() => setVisible((current) => !current)}>
          <Icon name={visible ? 'EyeOff' : 'Eye'} decorative size='sm' />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

const pendingLabels = { password: 'Signing in…', email: 'Sending link…', signup: 'Creating account…' };
const passwordHints = { password: 'Use the password for your account.', signup: 'Choose a password for your account.' };

/**
 * Form layout and pending/error presentation; the host owns authentication.
 * `mode` is `password` (email and password), `email` (a magic link) or `signup` (name, email and a new password).
 * `providers` adds a row of single sign-on buttons above the form; `onProvider(id)` runs the host's redirect or popup.
 */
export default function AuthForm({
  title = 'Sign in',
  description,
  mode = 'password',
  onSubmit,
  submitLabel = 'Sign in',
  pendingLabel = pendingLabels[mode],
  successMessage = 'Check your inbox for the next step.',
  errorMessage = 'Sign-in failed. Check your details and try again.',
  footer,
  children,
  identifier = 'email',
  nameLabel = 'Full name',
  emailLabel = 'Email',
  passwordLabel = 'Password',
  emailPlaceholder,
  passwordPlaceholder,
  passwordHint = passwordHints[mode],
  passwordMinLength,
  passwordAction,
  providers = [],
  onProvider,
  providerLayout = 'grid',
  dividerLabel = 'or',
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password'
}) {
  const [pending, setPending] = useState(false);
  const [provider, setProvider] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const busy = useRef(false);
  const isMounted = useIsMounted();
  const passwordId = useId();
  // Form submission and provider sign-in share one pending guard so only one request runs at a time.
  const run = async (request, providerId = '') => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setProvider(providerId);
    setError(false);
    setSuccess(false);
    try {
      await request();
      if (isMounted() && !providerId) setSuccess(true);
    } catch {
      if (isMounted()) setError(true);
    } finally {
      busy.current = false;
      if (isMounted()) {
        setPending(false);
        setProvider('');
      }
    }
  };
  const submit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    run(() => onSubmit(values));
  };
  const username = identifier === 'username';
  const IdentifierInput = username ? Input : EmailInput;
  const showHint = passwordHint !== false && passwordHint != null && passwordHint !== '';
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
        {providers.length ? (
          <>
            <div data-slot='auth-providers' className={providerLayout === 'stack' || providers.length === 1 ? 'grid gap-2' : 'grid gap-2 sm:grid-cols-2'}>
              {providers.map((item) => (
                <Button key={item.id} type='button' variant='outline' tone='neutral' onClick={() => run(() => onProvider?.(item.id), item.id)}>
                  {item.icon}
                  {provider === item.id ? 'Redirecting…' : item.label}
                </Button>
              ))}
            </div>
            {dividerLabel ? (
              <div data-slot='auth-divider' className='text-text-muted flex items-center gap-3 text-xs'>
                <span aria-hidden='true' className='bg-border h-px flex-1' />
                {dividerLabel}
                <span aria-hidden='true' className='bg-border h-px flex-1' />
              </div>
            ) : null}
          </>
        ) : null}
        {mode === 'signup' && (
          <Field>
            <FieldLabel>{nameLabel}</FieldLabel>
            <Input name='name' autoComplete='name' required />
          </Field>
        )}
        <Field>
          <FieldLabel>{emailLabel}</FieldLabel>
          <IdentifierInput
            name={username ? 'username' : 'email'}
            autoComplete={username ? 'username' : 'email'}
            placeholder={emailPlaceholder}
            required
          />
        </Field>
        {mode !== 'email' && (
          <Field>
            {passwordAction ? (
              <div className='flex items-center justify-between gap-3'>
                <FieldLabel htmlFor={`${passwordId}-input`}>{passwordLabel}</FieldLabel>
                {passwordAction}
              </div>
            ) : (
              <FieldLabel htmlFor={`${passwordId}-input`}>{passwordLabel}</FieldLabel>
            )}
            <PasswordInput
              id={`${passwordId}-input`}
              describedBy={showHint ? `${passwordId}-hint` : undefined}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={passwordMinLength}
              placeholder={passwordPlaceholder}
              showLabel={showPasswordLabel}
              hideLabel={hidePasswordLabel}
            />
            {showHint && <FieldDescription id={`${passwordId}-hint`}>{passwordHint}</FieldDescription>}
          </Field>
        )}
        {children}
        <Button type='submit' disabled={pending}>
          {pending && !provider ? pendingLabel : submitLabel}
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

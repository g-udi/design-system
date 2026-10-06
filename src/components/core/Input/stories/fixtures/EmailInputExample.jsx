import { useRef, useState } from 'react';
import { EmailInput } from '@gaudi/design-system/core/Input';
import Button from '@gaudi/design-system/core/Button';
import { Field, FieldLabel, FieldDescription, FieldError } from '@gaudi/design-system/core/Field';

export function EmailInputExample() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const input = useRef(null);
  const describeError = (control) => control.validity.valueMissing
    ? 'Enter your email address.'
    : 'Enter an address like name@example.com, without spaces.';

  return (
    <form
      className='grid w-full max-w-sm gap-4'
      onSubmit={event => { event.preventDefault(); setSubmitted(true); }}
      onReset={() => { setValue(''); setError(''); setSubmitted(false); }}
    >
      <Field>
        <FieldLabel>Email address</FieldLabel>
        <EmailInput
          ref={input}
          name='email'
          required
          value={value}
          placeholder='you@example.com'
          onChange={event => {
            setValue(event.target.value);
            setSubmitted(false);
            if (error) setError(event.target.validity.valid ? '' : describeError(event.target));
          }}
          onInvalid={event => {
            event.preventDefault();
            setError(describeError(event.currentTarget));
            input.current?.focus();
          }}
        />
        <FieldDescription>One email address. Required.</FieldDescription>
        <FieldError>{error}</FieldError>
      </Field>
      <div className='flex flex-wrap gap-2'>
        <Button type='submit'>Check email</Button>
        <Button type='reset' variant='outline'>Reset</Button>
      </div>
      <p role='status' className='text-sm text-text-muted'>
        {submitted ? 'Email format is valid. Nothing was sent.' : 'Validation only; this example does not send email.'}
      </p>
    </form>
  );
}

'use client';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@gaudi/design-system/core/Banner';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { FieldRoot as Field, FieldContent, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { CharacterCount, FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { EmailInput } from '@gaudi/design-system/core/Input';

const topics = [
  { value: 'question', label: 'A question about a post' },
  { value: 'speaking', label: 'Speaking or a podcast' },
  { value: 'work', label: 'Consulting work' },
  { value: 'other', label: 'Something else' }
];
const rules = {
  name: validators.required('Enter your name.'),
  email: [validators.required('Enter your email address.'), validators.email()],
  topic: validators.required('Choose what this is about.'),
  message: [validators.required('Write a message.'), validators.minLength(20, 'Write at least 20 characters so I can help.'), validators.maxLength(600)],
  consent: validators.required('Confirm I can reply by email.')
};
const labels = { name: 'Name', email: 'Email', topic: 'Topic', message: 'Message', consent: 'Consent' };
const initialValues = { name: '', email: '', topic: '', message: '', consent: false };

export function Pattern() {
  const form = useFormValidation({ initialValues, rules });
  const [sent, setSent] = useState(null);
  const { values, errors } = form;

  if (sent) {
    return (
      <div className='mx-auto grid w-full max-w-lg gap-4'>
        <Alert variant='success'>
          <RegistryIcon lucide='CircleCheckIcon' aria-hidden='true' />
          <AlertTitle>Thanks, {sent.name.split(' ')[0]}</AlertTitle>
          <AlertDescription>Your message is on its way. I usually reply within two working days to {sent.email}.</AlertDescription>
        </Alert>
        <Button
          variant='outline'
          tone='neutral'
          className='justify-self-start'
          onClick={() => {
            form.reset();
            setSent(null);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={form.handleSubmit((data) => setSent(data))} aria-labelledby='contact-form-title' className='mx-auto grid w-full max-w-lg gap-5 rounded-lg border p-5 sm:p-6'>
      <div className='grid gap-1'>
        <h2 id='contact-form-title' className='text-lg font-semibold'>Get in touch</h2>
        <p className='text-text-muted text-sm'>Questions about a post, talks or work. Every field is required.</p>
      </div>
      <FormErrorSummary form={form} labels={labels} />
      <FieldGroup className='gap-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor={form.id('name')}>Name</FieldLabel>
            <Input {...form.field('name')} autoComplete='name' />
            <FieldError id={form.errorId('name')}>{errors.name}</FieldError>
          </Field>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor={form.id('email')}>Email</FieldLabel>
            <EmailInput {...form.field('email')}  autoComplete='email' placeholder='you@example.com' />
            <FieldError id={form.errorId('email')}>{errors.email}</FieldError>
          </Field>
        </div>
        <Field data-invalid={errors.topic ? true : undefined}>
          <FieldLabel htmlFor={form.id('topic')}>Topic</FieldLabel>
          <Select value={values.topic} onValueChange={(value) => form.setValue('topic', value)}>
            <SelectTrigger
              id={form.id('topic')}
              className='w-full'
              aria-invalid={errors.topic ? true : undefined}
              aria-describedby={errors.topic ? form.errorId('topic') : undefined}
            >
              <SelectValue placeholder='Choose a topic' />
            </SelectTrigger>
            <SelectContent position='popper'>
              {topics.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id={form.errorId('topic')}>{errors.topic}</FieldError>
        </Field>
        <Field data-invalid={errors.message ? true : undefined}>
          <div className='flex items-baseline justify-between gap-3'>
            <FieldLabel htmlFor={form.id('message')}>Message</FieldLabel>
            <CharacterCount id={form.id('message-count')} value={values.message} max={600} />
          </div>
          <Textarea {...form.field('message', { describedBy: form.id('message-count') })} rows={5} />
          <FieldError id={form.errorId('message')}>{errors.message}</FieldError>
        </Field>
        <Field orientation='horizontal' data-invalid={errors.consent ? true : undefined}>
          <Checkbox
            id={form.id('consent')}
            checked={values.consent}
            onCheckedChange={(checked) => form.setValue('consent', checked === true)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={[form.id('consent-hint'), errors.consent ? form.errorId('consent') : null].filter(Boolean).join(' ')}
          />
          <FieldContent>
            <FieldLabel htmlFor={form.id('consent')}>You can reply to me by email</FieldLabel>
            <FieldDescription id={form.id('consent-hint')}>Your address is used for this conversation only.</FieldDescription>
            <FieldError id={form.errorId('consent')}>{errors.consent}</FieldError>
          </FieldContent>
        </Field>
      </FieldGroup>
      <div className='flex flex-wrap items-center justify-end gap-2'>
        <Button type='button' variant='ghost' tone='neutral' onClick={() => form.reset()}>Clear</Button>
        <Button type='submit' disabled={form.submitting}>
          <RegistryIcon lucide='SendIcon' aria-hidden='true' />
          {form.submitting ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

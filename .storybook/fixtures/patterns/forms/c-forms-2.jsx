'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const topics = [
  { id: 'engineering', label: 'Engineering', hint: 'Architecture, tooling and code' },
  { id: 'design', label: 'Design', hint: 'Interfaces and design systems' },
  { id: 'research', label: 'Research', hint: 'Knowledge graphs and papers' },
  { id: 'notes', label: 'Short notes', hint: 'Links and quick thoughts' }
];
const frequencies = [
  { value: 'weekly', label: 'Weekly', description: 'A Sunday morning digest' },
  { value: 'monthly', label: 'Monthly', description: 'The best of the month' },
  { value: 'posts', label: 'Every post', description: 'As soon as it is out' }
];
const rules = {
  email: [validators.required('Enter your email to subscribe.'), validators.email()],
  topics: validators.required('Pick at least one topic.')
};
const initialValues = { email: '', frequency: 'weekly', topics: ['engineering', 'design'] };

export function Pattern() {
  const form = useFormValidation({ initialValues, rules, validateOn: 'submit' });
  const [step, setStep] = useState('email');
  const { values, errors } = form;
  const toggle = (id, on) => form.setValue('topics', on ? [...values.topics, id] : values.topics.filter((topic) => topic !== id));

  return (
    <div className='mx-auto grid w-full max-w-xl gap-4'>
      <section aria-labelledby='newsletter-title' className='bg-surface-muted grid gap-4 rounded-lg border p-5 sm:p-6'>
        <div className='flex items-start gap-3'>
          <span className='bg-accent-subtle text-accent grid size-9 shrink-0 place-items-center rounded-md'>
            <RegistryIcon lucide='MailIcon' aria-hidden='true' />
          </span>
          <div className='grid gap-1'>
            <h2 id='newsletter-title' className='text-lg font-semibold'>The weekly letter</h2>
            <p className='text-text-muted text-sm'>New essays and the best links I read, every Sunday. 4,200 readers, no tracking, one-click unsubscribe.</p>
          </div>
        </div>
        {step === 'done' ? (
          <p role='status' className='text-sm'>
            <strong>Check your inbox.</strong> A confirmation link is on its way to {values.email}: {values.topics.length}{' '}
            {values.topics.length === 1 ? 'topic' : 'topics'}, {frequencies.find((item) => item.value === values.frequency).label.toLowerCase()}.
          </p>
        ) : (
          <form noValidate aria-label='Subscribe to the newsletter' onSubmit={form.handleSubmit(() => setStep(step === 'email' ? 'preferences' : 'done'))} className='grid gap-4'>
            <Field data-invalid={errors.email ? true : undefined}>
              <FieldLabel htmlFor={form.id('email')} className='sr-only'>Email address</FieldLabel>
              <div className='flex flex-col gap-2 sm:flex-row'>
                <Input {...form.field('email')} type='email' autoComplete='email' placeholder='you@example.com' className='flex-1' readOnly={step !== 'email'} />
                {step === 'email' ? <Button type='submit'>Subscribe</Button> : null}
              </div>
              <FieldError id={form.errorId('email')}>{errors.email}</FieldError>
            </Field>
            {step === 'preferences' ? (
              <>
                <RadioGroup label='How often' value={values.frequency} onValueChange={(value) => form.setValue('frequency', value)} variant='cards' options={frequencies} />
                <FieldSet aria-describedby={errors.topics ? form.errorId('topics') : undefined}>
                  <FieldLegend variant='label'>Topics</FieldLegend>
                  <div id={form.id('topics')} className='grid gap-3 sm:grid-cols-2'>
                    {topics.map((topic) => (
                      <Field key={topic.id} orientation='horizontal'>
                        <Checkbox id={form.id(`topic-${topic.id}`)} checked={values.topics.includes(topic.id)} onCheckedChange={(on) => toggle(topic.id, on === true)} />
                        <FieldContent>
                          <FieldLabel htmlFor={form.id(`topic-${topic.id}`)}>{topic.label}</FieldLabel>
                          <FieldDescription>{topic.hint}</FieldDescription>
                        </FieldContent>
                      </Field>
                    ))}
                  </div>
                  <FieldError id={form.errorId('topics')}>{errors.topics}</FieldError>
                </FieldSet>
                <div className='flex justify-end gap-2'>
                  <Button type='button' variant='ghost' tone='neutral' onClick={() => setStep('email')}>Change email</Button>
                  <Button type='submit'>Confirm subscription</Button>
                </div>
              </>
            ) : null}
          </form>
        )}
      </section>
      <form aria-label='Subscribe below a post' onSubmit={(event) => event.preventDefault()} className='flex flex-col items-stretch gap-2 border-t pt-4 sm:flex-row sm:items-center'>
        <p className='text-sm font-medium sm:flex-1'>Enjoyed this post? Get the next one by email.</p>
        <label htmlFor='newsletter-inline-email' className='sr-only'>Email address</label>
        <Input id='newsletter-inline-email' type='email' autoComplete='email' placeholder='you@example.com' className='sm:w-56' />
        <Button type='submit' variant='outline' tone='neutral'>Subscribe</Button>
      </form>
    </div>
  );
}

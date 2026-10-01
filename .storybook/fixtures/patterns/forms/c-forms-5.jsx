'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
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
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const tickets = [
  { value: 'early', label: 'Early bird', description: '£45 · 4 left', price: 45, left: 4 },
  { value: 'standard', label: 'Standard', description: '£75 · 38 left', price: 75, left: 38 },
  { value: 'supporter', label: 'Supporter', description: '£120 · includes the printed book', price: 120, left: 12 }
];
const workshops = [
  { id: 'graphs', label: 'Knowledge graphs in practice', time: '10:00', seats: 6 },
  { id: 'writing', label: 'Technical writing clinic', time: '13:30', seats: 0 },
  { id: 'systems', label: 'Design systems for content', time: '15:00', seats: 14 }
];
const diets = ['No requirements', 'Vegetarian', 'Vegan', 'Gluten free', 'Other (tell us below)'];
const CODE = '204816';

const rules = {
  email: [validators.required('Enter the email for your tickets.'), validators.email()],
  verified: (value) => (value ? '' : 'Verify your email with the 6-digit code.'),
  attendees: (names) => (names.some((name) => !name.trim()) ? 'Enter a name for every ticket.' : '')
};
const labels = { email: 'Email', verified: 'Verification', attendees: 'Attendees' };
const initialValues = { ticket: 'standard', quantity: 1, attendees: [''], email: '', code: '', verified: false, workshops: ['graphs'], diet: 'No requirements', notes: '' };

export function Pattern() {
  const form = useFormValidation({ initialValues, rules, validateOn: 'submit' });
  const [codeSent, setCodeSent] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [booked, setBooked] = useState(false);
  const { values, errors } = form;
  const ticket = tickets.find((item) => item.value === values.ticket);
  const setQuantity = (quantity) => {
    const count = Math.max(1, Math.min(ticket.left, Number(quantity) || 1));
    form.setValues((current) => ({ ...current, quantity: count, attendees: Array.from({ length: count }, (_, index) => current.attendees[index] ?? '') }));
  };
  const verify = (code) => {
    form.setValue('code', code);
    if (code.length < 6) return setCodeError('');
    if (code === CODE) {
      form.setValue('verified', true);
      setCodeError('');
    } else setCodeError('That code does not match. Check the latest email.');
  };

  if (booked) {
    return (
      <div role='status' className='mx-auto grid w-full max-w-xl gap-2 rounded-lg border p-6'>
        <p className='text-lg font-semibold'>You’re registered</p>
        <p className='text-text-muted text-sm'>
          {values.quantity} × {ticket.label} for Saturday 14 November. Tickets and a calendar invite are on their way to {values.email}.
        </p>
      </div>
    );
  }

  return (
    <form noValidate aria-labelledby='event-form-title' onSubmit={form.handleSubmit(() => setBooked(true))} className='mx-auto grid w-full max-w-xl gap-5 rounded-lg border p-5 sm:p-6'>
      <div className='grid gap-1'>
        <Badge variant='info-light' size='sm' className='justify-self-start'>Saturday 14 November · London</Badge>
        <h2 id='event-form-title' className='text-lg font-semibold'>Register for Small Tools Day</h2>
      </div>
      <FormErrorSummary form={form} labels={labels} />
      <RadioGroup
        label='Ticket'
        variant='cards'
        value={values.ticket}
        onValueChange={(value) => {
          form.setValue('ticket', value);
          setQuantity(Math.min(values.quantity, tickets.find((item) => item.value === value).left));
        }}
        options={tickets}
      />
      <NumberField value={values.quantity} min={1} max={ticket.left} onValueChange={setQuantity} className='max-w-40'>
        <NumberFieldScrubArea label='Tickets' />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldSet aria-describedby={errors.attendees ? form.errorId('attendees') : undefined}>
        <FieldLegend variant='label'>Attendees</FieldLegend>
        <div id={form.id('attendees')} className='grid gap-3 sm:grid-cols-2'>
          {values.attendees.map((name, index) => (
            <Field key={index} data-invalid={errors.attendees && !name.trim() ? true : undefined}>
              <FieldLabel htmlFor={form.id(`attendee-${index}`)}>Ticket {index + 1} name</FieldLabel>
              <Input
                id={form.id(`attendee-${index}`)}
                value={name}
                autoComplete={index === 0 ? 'name' : 'off'}
                aria-invalid={errors.attendees && !name.trim() ? true : undefined}
                onChange={(event) => form.setValue('attendees', values.attendees.map((item, at) => (at === index ? event.target.value : item)))}
              />
            </Field>
          ))}
        </div>
        <FieldError id={form.errorId('attendees')}>{errors.attendees}</FieldError>
      </FieldSet>
      <FieldGroup className='gap-3'>
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor={form.id('email')}>Email for tickets</FieldLabel>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Input {...form.field('email')} type='email' autoComplete='email' className='flex-1' readOnly={values.verified} />
            {values.verified ? (
              <Badge variant='success-light' className='self-center'>
                <RegistryIcon lucide='CircleCheckIcon' aria-hidden='true' />
                Verified
              </Badge>
            ) : (
              <Button type='button' variant='outline' tone='neutral' onClick={() => setCodeSent(!errors.email && /\S+@\S+\.\S+/.test(values.email))}>
                {codeSent ? 'Resend code' : 'Send code'}
              </Button>
            )}
          </div>
          <FieldError id={form.errorId('email')}>{errors.email}</FieldError>
        </Field>
        {codeSent && !values.verified ? (
          <Field data-invalid={codeError || errors.verified ? true : undefined}>
            <FieldLabel htmlFor={form.id('verified')}>6-digit code</FieldLabel>
            <InputOTP
              id={form.id('verified')}
              maxLength={6}
              value={values.code}
              onChange={verify}
              aria-describedby={[form.id('code-hint'), codeError || errors.verified ? form.errorId('verified') : null].filter(Boolean).join(' ')}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription id={form.id('code-hint')}>Sent to {values.email}. For this demo the code is {CODE}.</FieldDescription>
            <FieldError id={form.errorId('verified')}>{codeError || errors.verified}</FieldError>
          </Field>
        ) : !values.verified && errors.verified ? (
          <FieldError id={form.errorId('verified')}>{errors.verified}</FieldError>
        ) : null}
      </FieldGroup>
      <FieldSet>
        <FieldLegend variant='label'>Afternoon workshops</FieldLegend>
        <FieldDescription>Pick any that fit. Seats are held for 15 minutes.</FieldDescription>
        <div className='grid gap-2'>
          {workshops.map((workshop) => {
            const full = workshop.seats === 0;
            return (
              <Field key={workshop.id} orientation='horizontal' data-disabled={full || undefined}>
                <Checkbox
                  id={form.id(`workshop-${workshop.id}`)}
                  disabled={full}
                  checked={values.workshops.includes(workshop.id)}
                  onCheckedChange={(on) => form.setValue('workshops', on ? [...values.workshops, workshop.id] : values.workshops.filter((id) => id !== workshop.id))}
                />
                <FieldLabel htmlFor={form.id(`workshop-${workshop.id}`)} className='flex-1 font-normal'>
                  <span className='text-text-muted w-12 shrink-0 tabular-nums'>{workshop.time}</span>
                  {workshop.label}
                </FieldLabel>
                <Badge size='sm' variant={full ? 'secondary' : 'success-light'}>{full ? 'Full' : `${workshop.seats} seats`}</Badge>
              </Field>
            );
          })}
        </div>
      </FieldSet>
      <Field>
        <FieldLabel htmlFor={form.id('diet')}>Dietary needs</FieldLabel>
        <Select value={values.diet} onValueChange={(diet) => form.setValue('diet', diet)}>
          <SelectTrigger id={form.id('diet')} className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            {diets.map((diet) => (
              <SelectItem key={diet} value={diet}>{diet}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className='flex flex-wrap items-center justify-between gap-3 border-t pt-4'>
        <p className='text-sm'>
          Total <strong className='tabular-nums'>£{(ticket.price * values.quantity).toFixed(2)}</strong>
        </p>
        <Button type='submit'>Register</Button>
      </div>
    </form>
  );
}

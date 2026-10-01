'use client';
import { useState } from 'react';
import { default as Field, FieldDescription, FieldError, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';

const steps = [
  { id: 'plan', label: 'Plan', description: 'Tier and billing' },
  { id: 'seats', label: 'Seats', description: 'Who needs access' },
  { id: 'payment', label: 'Payment', description: 'Card and invoices' },
  { id: 'review', label: 'Review', description: 'Confirm the change' }
];
const plans = { starter: ['Starter', 8], team: ['Team', 16], business: ['Business', 32] };
const credit = 37.5;
const money = (value) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);

function Invoice({ plan, period, seats }) {
  const [name, price] = plans[plan];
  const months = period === 'yearly' ? 10 : 1;
  const subtotal = price * Math.max(Number(seats) || 0, 0) * months;
  const tax = (subtotal - credit) * 0.2;
  const due = Math.max(subtotal - credit + tax, 0);
  return (
    <section aria-label='Invoice preview' className='bg-surface-muted grid gap-3 rounded-lg border p-4 text-sm'>
      <h3 className='font-medium'>Invoice preview</h3>
      <dl className='grid gap-2'>
        <div className='flex justify-between gap-3'>
          <dt className='text-text-muted'>{name} × {seats || 0} {period === 'yearly' ? '(12 months for 10)' : '(monthly)'}</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div className='flex justify-between gap-3'>
          <dt className='text-text-muted'>Unused time on Starter</dt>
          <dd>−{money(credit)}</dd>
        </div>
        <div className='flex justify-between gap-3'>
          <dt className='text-text-muted'>VAT 20%</dt>
          <dd>{money(Math.max(tax, 0))}</dd>
        </div>
      </dl>
      <Separator />
      <div className='flex items-baseline justify-between gap-3'>
        <span className='font-medium'>Due today</span>
        <span className='text-lg font-semibold' aria-live='polite'>{money(due)}</span>
      </div>
    </section>
  );
}

export function Pattern() {
  const [plan, setPlan] = useState('team');
  const [period, setPeriod] = useState('yearly');
  const [seats, setSeats] = useState('12');
  const [card, setCard] = useState({ name: '', number: '', email: 'billing@northwind.dev' });
  const [checked, setChecked] = useState(false);
  const seatsValid = Number(seats) >= 1 && Number(seats) <= 200;
  const cardValid = card.name.trim() && card.number.replace(/\s/g, '').length >= 12;
  const validateStep = (index) => {
    const ok = index === 1 ? seatsValid : index === 2 ? Boolean(cardValid) : true;
    if (!ok) setChecked(true);
    return ok;
  };
  const setCardField = (key) => (event) => setCard((current) => ({ ...current, [key]: event.target.value }));
  return (
    <div className='w-full max-w-4xl rounded-xl border p-5'>
      <Wizard
        title='Upgrade your plan'
        description='Changes apply today; we credit what is left of your current plan.'
        steps={steps}
        validateStep={validateStep}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
        completeLabel='Confirm and pay'
        completionTitle={`You are on ${plans[plan][0]}`}
        completionDescription='The receipt is on its way to your billing email.'
        aside={(_, complete) => (complete ? null : <Invoice plan={plan} period={period} seats={seats} />)}
      >
        {(step) =>
          step === 0 ? (
            <div className='grid gap-4'>
              <RadioGroup
                label='Plan'
                variant='cards'
                value={plan}
                onValueChange={setPlan}
                options={Object.entries(plans).map(([value, [label, price]]) => ({ value, label: `${label} · €${price} per seat`, description: value === 'business' ? 'SSO, audit log and priority support.' : value === 'team' ? 'Shared workspaces and roles.' : 'For a few collaborators.' }))}
              />
              <div className='grid gap-2'>
                <span id='period-label' className='text-sm font-medium'>Billing period</span>
                <ToggleGroup aria-labelledby='period-label' type='single' variant='outline' size='sm' spacing={0} value={period} onValueChange={(next) => setPeriod(next || period)}>
                  <ToggleGroupItem value='monthly'>Monthly</ToggleGroupItem>
                  <ToggleGroupItem value='yearly'>Yearly · 2 months free</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          ) : step === 1 ? (
            <Field>
              <FieldLabel>Seats</FieldLabel>
              <Input type='number' name='seats' min={1} max={200} value={seats} invalid={checked && !seatsValid} onChange={(event) => setSeats(event.target.value)} />
              <FieldDescription>You have 9 members and 3 pending invites.</FieldDescription>
              <FieldError>{checked && !seatsValid ? 'Choose between 1 and 200 seats.' : null}</FieldError>
            </Field>
          ) : step === 2 ? (
            <div className='grid gap-4'>
              <Field>
                <FieldLabel>Name on card</FieldLabel>
                <Input name='card-name' autoComplete='cc-name' value={card.name} invalid={checked && !card.name.trim()} onChange={setCardField('name')} />
                <FieldError>{checked && !card.name.trim() ? 'Enter the name on the card.' : null}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Card number</FieldLabel>
                <Input name='card-number' inputMode='numeric' autoComplete='cc-number' placeholder='4242 4242 4242 4242' value={card.number} invalid={checked && card.number.replace(/\s/g, '').length < 12} onChange={setCardField('number')} />
                <FieldError>{checked && card.number.replace(/\s/g, '').length < 12 ? 'Enter a full card number.' : null}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Send invoices to</FieldLabel>
                <Input type='email' name='billing-email' value={card.email} onChange={setCardField('email')} />
              </Field>
            </div>
          ) : (
            <dl className='grid gap-3 text-sm'>
              {[
                ['Plan', `${plans[plan][0]}, billed ${period}`],
                ['Seats', seats],
                ['Card', `${card.name} · ending ${card.number.replace(/\s/g, '').slice(-4)}`],
                ['Invoices', card.email]
              ].map(([term, value]) => (
                <div key={term} className='flex justify-between gap-3 border-b pb-3 last:border-b-0'>
                  <dt className='text-text-muted'>{term}</dt>
                  <dd className='text-end font-medium'>{value}</dd>
                </div>
              ))}
            </dl>
          )
        }
      </Wizard>
    </div>
  );
}

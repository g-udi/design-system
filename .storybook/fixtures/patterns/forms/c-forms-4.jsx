'use client';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { PhoneInput } from '../../../../src/components/core/PhoneInput/parts/phone-input-extended.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const countries = [
  { value: 'GB', label: 'United Kingdom', postcode: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, example: 'SW1A 1AA' },
  { value: 'DE', label: 'Germany', postcode: /^\d{5}$/, example: '10115' },
  { value: 'NL', label: 'Netherlands', postcode: /^\d{4} ?[A-Z]{2}$/i, example: '1011 AB' },
  { value: 'US', label: 'United States', postcode: /^\d{5}(-\d{4})?$/, example: '94103' }
];
const items = [
  { name: 'Field notes, hardcover', meta: 'Signed copy', price: 32 },
  { name: 'Sticker pack', meta: 'Set of 6', price: 8 }
];
const shipping = 6;
const digits = (value) => String(value || '').replace(/\D/g, '');
const groupCard = (value) => digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const groupExpiry = (value) => {
  const raw = digits(value).slice(0, 4);
  return raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
};
// Luhn check: catches most mistyped card numbers before they reach the payment provider.
const luhn = (value) => {
  const numbers = digits(value).split('').reverse().map(Number);
  return numbers.reduce((sum, digit, index) => sum + (index % 2 ? ((digit * 2) % 10) + Math.floor(digit / 5) : digit), 0) % 10 === 0;
};
const future = (value) => {
  const [month, year] = String(value).split('/').map(Number);
  if (!month || month > 12 || year == null) return false;
  return new Date(2000 + year, month) > new Date(2026, 9, 1);
};
const rules = {
  name: validators.required('Enter the name for delivery.'),
  line1: validators.required('Enter the street address.'),
  city: validators.required('Enter the town or city.'),
  country: validators.required('Choose a country.'),
  postcode: [
    validators.required('Enter the postcode.'),
    (value, values) => {
      const country = countries.find((item) => item.value === values.country);
      return country && !country.postcode.test(String(value).trim()) ? `Enter a postcode like ${country.example}.` : '';
    }
  ],
  card: [validators.required('Enter the card number.'), (value) => (digits(value).length < 15 || !luhn(value) ? 'Check the card number.' : '')],
  expiry: [validators.required('Enter the expiry date.'), (value) => (!future(value) ? 'Use a future date as MM/YY.' : '')],
  cvc: [validators.required('Enter the security code.'), validators.pattern(/^\d{3,4}$/, 'Use the 3 or 4 digits on the back.')]
};
const labels = { name: 'Full name', line1: 'Address', city: 'City', country: 'Country', postcode: 'Postcode', card: 'Card number', expiry: 'Expiry', cvc: 'Security code' };
const initialValues = { name: '', line1: '', line2: '', city: '', country: 'GB', postcode: '', phone: '', billingSame: true, card: '', expiry: '', cvc: '' };

function TextField({ form, name, label, optional, ...props }) {
  return (
    <Field data-invalid={form.errors[name] ? true : undefined}>
      <FieldLabel htmlFor={form.id(name)}>
        {label}
        {optional ? <span className='text-text-muted font-normal'> (optional)</span> : null}
      </FieldLabel>
      <Input {...form.field(name)} {...props} />
      <FieldError id={form.errorId(name)}>{form.errors[name]}</FieldError>
    </Field>
  );
}

export function Pattern() {
  const form = useFormValidation({ initialValues, rules });
  const [paid, setPaid] = useState(false);
  const { values, errors } = form;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const format = (amount) => `£${amount.toFixed(2)}`;

  return (
    <div className='mx-auto grid w-full max-w-4xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]'>
      <form noValidate aria-labelledby='checkout-title' onSubmit={form.handleSubmit(() => setPaid(true))} className='grid gap-6'>
        <h2 id='checkout-title' className='text-lg font-semibold'>Checkout</h2>
        {paid ? (
          <Alert variant='success'>
            <RegistryIcon lucide='CircleCheckIcon' aria-hidden='true' />
            <AlertTitle>Order placed</AlertTitle>
            <AlertDescription>We sent a receipt and tracking details. Your order ships to {values.city} within two days.</AlertDescription>
          </Alert>
        ) : (
          <FormErrorSummary form={form} labels={labels} />
        )}
        <FieldSet>
          <FieldLegend>Shipping address</FieldLegend>
          <FieldGroup className='gap-4'>
            <TextField form={form} name='name' label='Full name' autoComplete='shipping name' />
            <TextField form={form} name='line1' label='Street address' autoComplete='shipping address-line1' />
            <TextField form={form} name='line2' label='Apartment, suite or floor' optional autoComplete='shipping address-line2' />
            <div className='grid gap-4 sm:grid-cols-3'>
              <TextField form={form} name='city' label='City' autoComplete='shipping address-level2' />
              <Field data-invalid={errors.country ? true : undefined}>
                <FieldLabel htmlFor={form.id('country')}>Country</FieldLabel>
                <Select value={values.country} onValueChange={(country) => form.setValue('country', country)}>
                  <SelectTrigger id={form.id('country')} className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <TextField form={form} name='postcode' label='Postcode' autoComplete='shipping postal-code' />
            </div>
            <Field>
              <FieldLabel htmlFor={form.id('phone')}>
                Phone <span className='text-text-muted font-normal'>(optional, for delivery updates)</span>
              </FieldLabel>
              <PhoneInput id={form.id('phone')} defaultCountry={values.country} value={values.phone} onChange={(phone) => form.setValue('phone', phone || '')} />
            </Field>
            <Field orientation='horizontal'>
              <Checkbox id={form.id('billing-same')} checked={values.billingSame} onCheckedChange={(checked) => form.setValue('billingSame', checked === true)} />
              <FieldLabel htmlFor={form.id('billing-same')}>Billing address is the same as shipping</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Separator />
        <FieldSet>
          <FieldLegend>Payment</FieldLegend>
          <FieldGroup className='gap-4'>
            <TextField
              form={form}
              name='card'
              label='Card number'
              inputMode='numeric'
              autoComplete='cc-number'
              placeholder='1234 1234 1234 1234'
              value={values.card}
              onChange={(event) => form.setValue('card', groupCard(event.target.value))}
              prefix={<RegistryIcon lucide='CreditCardIcon' aria-hidden='true' />}
            />
            <div className='grid grid-cols-2 gap-4'>
              <TextField
                form={form}
                name='expiry'
                label='Expiry (MM/YY)'
                inputMode='numeric'
                autoComplete='cc-exp'
                placeholder='08/29'
                value={values.expiry}
                onChange={(event) => form.setValue('expiry', groupExpiry(event.target.value))}
              />
              <TextField form={form} name='cvc' label='Security code' inputMode='numeric' autoComplete='cc-csc' maxLength={4} placeholder='123' />
            </div>
            <p className='text-text-muted flex items-center gap-2 text-xs'>
              <RegistryIcon lucide='LockIcon' aria-hidden='true' className='size-3.5' />
              Card details go straight to the payment provider and are never stored here.
            </p>
          </FieldGroup>
        </FieldSet>
        <Button type='submit' size='lg' disabled={paid}>Pay {format(subtotal + shipping)}</Button>
      </form>
      <aside aria-labelledby='order-summary-title' className='bg-surface-muted grid gap-3 rounded-lg border p-4 lg:sticky lg:top-4'>
        <h3 id='order-summary-title' className='text-sm font-semibold'>Order summary</h3>
        <ul className='grid gap-3'>
          {items.map((item) => (
            <li key={item.name} className='flex justify-between gap-3 text-sm'>
              <span className='grid'>
                {item.name}
                <span className='text-text-muted text-xs'>{item.meta}</span>
              </span>
              <span className='tabular-nums'>{format(item.price)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <dl className='grid gap-1 text-sm'>
          <div className='flex justify-between'><dt className='text-text-muted'>Subtotal</dt><dd className='tabular-nums'>{format(subtotal)}</dd></div>
          <div className='flex justify-between'><dt className='text-text-muted'>Shipping</dt><dd className='tabular-nums'>{format(shipping)}</dd></div>
          <div className='flex justify-between font-semibold'><dt>Total</dt><dd className='tabular-nums'>{format(subtotal + shipping)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}

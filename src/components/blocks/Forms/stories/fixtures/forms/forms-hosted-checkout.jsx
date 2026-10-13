'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CardRoot as Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gaudi/design-system/core/Card';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import { FieldRoot as Field, FieldContent, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import Link from '@gaudi/design-system/core/Link';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput
} from '@gaudi/design-system/core/NumberField';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { Badge } from '@gaudi/design-system/core/Pill';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const methods = [
  { id: 'card', label: 'Cards', hint: 'Visa, Mastercard, Amex' },
  { id: 'wallets', label: 'Wallets', hint: 'Apple Pay and Google Pay' },
  { id: 'bank', label: 'Bank transfer', hint: 'SEPA and BACS, 1–3 days' },
  { id: 'link', label: 'Pay by link', hint: 'Saved details, one tap' }
];
const collect = [
  { id: 'billing', label: 'Billing address' },
  { id: 'shipping', label: 'Shipping address' },
  { id: 'phone', label: 'Phone number' },
  { id: 'tax', label: 'Tax ID for businesses' }
];
const url = validators.pattern(/^https:\/\/\S+\.\S+/, 'Use a full https:// address.');
const rules = {
  product: validators.required('Name what people are paying for.'),
  methods: validators.required('Turn on at least one payment method.'),
  success: [validators.required('Add where to send people after paying.'), url],
  cancel: url
};
const labels = { product: 'Product', methods: 'Payment methods', success: 'Success page', cancel: 'Cancel page' };

function Row({ label, htmlFor, description, children }) {
  return (
    <Field orientation='responsive'>
      <FieldContent className='@md/field-group:max-w-60'>
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <div className='grid min-w-0 gap-1.5 @md/field-group:w-full! @md/field-group:max-w-sm'>{children}</div>
    </Field>
  );
}

function CheckList({ form, name, legend, options }) {
  const selected = form.values[name];
  return (
    <FieldSet aria-describedby={form.errors[name] ? form.errorId(name) : undefined}>
      <FieldLegend variant='label' className='sr-only'>{legend}</FieldLegend>
      <div id={form.id(name)} className='grid gap-2'>
        {options.map((option) => (
          <Field key={option.id} orientation='horizontal'>
            <Checkbox
              id={form.id(`${name}-${option.id}`)}
              checked={selected.includes(option.id)}
              onCheckedChange={(on) => form.setValue(name, on ? [...selected, option.id] : selected.filter((id) => id !== option.id))}
            />
            <FieldContent>
              <FieldLabel htmlFor={form.id(`${name}-${option.id}`)} className='font-normal'>{option.label}</FieldLabel>
              {option.hint ? <FieldDescription>{option.hint}</FieldDescription> : null}
            </FieldContent>
          </Field>
        ))}
      </div>
      <FieldError id={form.errorId(name)}>{form.errors[name]}</FieldError>
    </FieldSet>
  );
}

export function Pattern() {
  const form = useFormValidation({
    initialValues: { product: 'Supporter membership', mode: 'subscription', currency: 'GBP', methods: ['card', 'wallets'], collect: ['billing'], label: 'subscribe', promo: true, trial: 14, success: 'https://gaudi.dev/thanks', cancel: '' },
    rules
  });
  const [link, setLink] = useState('');
  const { values, errors } = form;
  const labelText = { pay: 'Pay', subscribe: 'Subscribe', donate: 'Donate', book: 'Book' }[values.label];

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <form noValidate aria-labelledby='checkout-setup-title' onSubmit={form.handleSubmit(() => setLink('https://pay.gaudi.dev/c/supporter-7Hk2'))} className='flex flex-col gap-(--card-spacing)'>
        <CardHeader>
          <CardTitle id='checkout-setup-title'>Hosted checkout</CardTitle>
          <CardDescription>A payment page you can link to from posts, emails or a button.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-5'>
          <FormErrorSummary form={form} labels={labels} />
          <FieldGroup className='gap-5'>
            <Row label='Product' htmlFor={form.id('product')} description='Shown at the top of the page.'>
              <Input {...form.field('product')} aria-invalid={errors.product ? true : undefined} />
              <FieldError id={form.errorId('product')}>{errors.product}</FieldError>
            </Row>
            <Row label='Charge' htmlFor={form.id('mode')}>
              <div className='grid grid-cols-[minmax(0,1fr)_6rem] gap-2'>
                <Select value={values.mode} onValueChange={(mode) => form.setValue('mode', mode)}>
                  <SelectTrigger id={form.id('mode')} className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='payment'>One-off payment</SelectItem>
                    <SelectItem value='subscription'>Subscription</SelectItem>
                    <SelectItem value='donation'>Pay what you want</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={values.currency} onValueChange={(currency) => form.setValue('currency', currency)}>
                  <SelectTrigger aria-label='Currency' className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='GBP'>GBP</SelectItem>
                    <SelectItem value='EUR'>EUR</SelectItem>
                    <SelectItem value='USD'>USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Row>
            {values.mode === 'subscription' ? (
              <Row label='Free trial' htmlFor={form.id('trial')} description='Days before the first charge. 0 for none.'>
                <NumberField id={form.id('trial')} value={values.trial} min={0} max={90} onValueChange={(trial) => form.setValue('trial', trial ?? 0)} className='max-w-36'>
                  <NumberFieldGroup>
                    <NumberFieldDecrement />
                    <NumberFieldInput aria-label='Free trial days' />
                    <NumberFieldIncrement />
                  </NumberFieldGroup>
                </NumberField>
              </Row>
            ) : null}
            <FieldSeparator />
            <Row label='Payment methods' description='Shown in this order. Wallets appear only on supported devices.'>
              <CheckList form={form} name='methods' legend='Payment methods' options={methods} />
            </Row>
            <Row label='Collect' description='Ask only for what you need to fulfil the order.'>
              <CheckList form={form} name='collect' legend='Details to collect' options={collect} />
            </Row>
            <Row label='Promotion codes' htmlFor={form.id('promo')}>
              <Switch id={form.id('promo')} checked={values.promo} onCheckedChange={(promo) => form.setValue('promo', promo)} />
            </Row>
            <FieldSeparator />
            <Row label='Button label' htmlFor={form.id('label')}>
              <Select value={values.label} onValueChange={(label) => form.setValue('label', label)}>
                <SelectTrigger id={form.id('label')} className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='pay'>Pay</SelectItem>
                  <SelectItem value='subscribe'>Subscribe</SelectItem>
                  <SelectItem value='donate'>Donate</SelectItem>
                  <SelectItem value='book'>Book</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row label='After paying' htmlFor={form.id('success')} description='Where people land when payment succeeds.'>
              <Input {...form.field('success')} type='url' inputMode='url' />
              <FieldError id={form.errorId('success')}>{errors.success}</FieldError>
            </Row>
            <Row label='If they cancel' htmlFor={form.id('cancel')} description='Optional. Defaults to the page they came from.'>
              <Input {...form.field('cancel')} type='url' inputMode='url' placeholder='https://' />
              <FieldError id={form.errorId('cancel')}>{errors.cancel}</FieldError>
            </Row>
          </FieldGroup>
        </CardContent>
        <CardFooter className='flex-wrap gap-3 border-t'>
          <div aria-hidden='true' className='bg-surface-muted flex min-w-0 flex-1 basis-60 items-center gap-3 rounded-md border px-3 py-2'>
            <RegistryIcon lucide='LockIcon' className='text-text-muted size-4 shrink-0' />
            <span className='truncate text-sm'>{values.product || 'Your product'}</span>
            <Badge className='ms-auto'>{labelText}</Badge>
          </div>
          {link ? (
            <p role='status' className='text-sm'>
              Live at <Link href={link} tone='accent' className='underline underline-offset-2'>{link.replace('https://', '')}</Link>
            </p>
          ) : null}
          <Button type='submit'>{link ? 'Update page' : 'Create checkout page'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

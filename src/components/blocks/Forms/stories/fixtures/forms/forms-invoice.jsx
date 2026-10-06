'use client';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@gaudi/design-system/core/Select';
import { FieldRoot as Field, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { PopoverPrimitive as Popover, PopoverContentPrimitive as PopoverContent, PopoverTriggerPrimitive as PopoverTrigger } from '@gaudi/design-system/core/Popover';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { Separator } from '@gaudi/design-system/core/Separator';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
import { InputGroupAddon, InputGroupText } from '@gaudi/design-system/core/Input';

const customers = {
  'Northwind Labs': { email: 'accounts@northwind.dev', address: '12 Canal Street, Manchester' },
  'Field Notes Press': { email: 'billing@fieldnotes.press', address: 'Prinsengracht 210, Amsterdam' },
  'Contoso Research': { email: 'ap@contoso.example', address: '400 Market St, San Francisco' }
};
const terms = { receipt: { label: 'Due on receipt', days: 0 }, net15: { label: 'Net 15', days: 15 }, net30: { label: 'Net 30', days: 30 } };
const currencies = { GBP: '£', EUR: '€', USD: '$' };
const taxes = { 0: 'No tax', 7: 'Reduced (7%)', 20: 'Standard (20%)' };
let nextId = 3;
const issued = new Date(2026, 9, 1);

const rules = {
  customer: validators.required('Choose who the invoice is for.'),
  items: (items) => {
    if (!items.length) return 'Add at least one line item.';
    if (items.some((item) => !item.description.trim())) return 'Describe every line item.';
    if (items.some((item) => !(item.quantity > 0) || !(item.rate >= 0))) return 'Use a quantity above 0 and a rate of 0 or more.';
    return '';
  },
  discount: [validators.min(0, 'Use a discount of 0% or more.'), validators.max(100, 'A discount cannot be over 100%.')],
  due: (due, values) => (due < values.issue ? 'The due date cannot be before the issue date.' : '')
};

function DateField({ id, label, value, onChange, invalid, describedBy }) {
  const [open, setOpen] = useState(false);
  return (
    <Field data-invalid={invalid ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id={id} type='button' variant='outline' tone='neutral' aria-invalid={invalid ? true : undefined} aria-describedby={describedBy} className='justify-start font-normal'>
            <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
            {format(value, 'd MMM yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            required
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export function Pattern() {
  const form = useFormValidation({
    initialValues: {
      customer: 'Northwind Labs',
      currency: 'GBP',
      issue: issued,
      terms: 'net30',
      due: addDays(issued, 30),
      items: [
        { id: 1, description: 'Design system audit', quantity: 3, rate: 850 },
        { id: 2, description: 'Component documentation', quantity: 12, rate: 95 }
      ],
      discount: 10,
      tax: '20',
      notes: 'Thank you for the work together. Bank details are on the second page.'
    },
    rules,
    validateOn: 'submit'
  });
  const [status, setStatus] = useState('Draft');
  const { values, errors } = form;
  const symbol = currencies[values.currency];
  const money = (amount) => `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const subtotal = values.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const discount = subtotal * ((Number(values.discount) || 0) / 100);
  const tax = (subtotal - discount) * (Number(values.tax) / 100);
  const total = subtotal - discount + tax;
  const updateItem = (id, change) => form.setValue('items', values.items.map((item) => (item.id === id ? { ...item, ...change } : item)));
  const customer = customers[values.customer];

  return (
    <form noValidate aria-labelledby='invoice-title' onSubmit={form.handleSubmit(() => setStatus('Sent'))} className='mx-auto grid w-full max-w-4xl grid-cols-[minmax(0,1fr)] gap-5 rounded-lg border p-5 sm:p-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 id='invoice-title' className='text-lg font-semibold'>Invoice INV-0042</h2>
        <Badge variant={status === 'Sent' ? 'success-light' : 'secondary'} aria-live='polite'>{status}</Badge>
      </div>
      <FormErrorSummary form={form} labels={{ customer: 'Customer', items: 'Line items', discount: 'Discount', due: 'Due date' }} />
      <div className='grid gap-4 md:grid-cols-2'>
        <Field data-invalid={errors.customer ? true : undefined}>
          <FieldLabel htmlFor={form.id('customer')}>Bill to</FieldLabel>
          <Combobox items={Object.keys(customers)} value={values.customer} onValueChange={(name) => form.setValue('customer', name || '')}>
            <ComboboxInput id={form.id('customer')} placeholder='Search customers' showClear aria-invalid={errors.customer ? true : undefined} aria-describedby={errors.customer ? form.errorId('customer') : undefined} />
            <ComboboxContent>
              <ComboboxEmpty>No customers found.</ComboboxEmpty>
              <ComboboxList>{(name) => <ComboboxItem key={name} value={name}>{name}</ComboboxItem>}</ComboboxList>
            </ComboboxContent>
          </Combobox>
          {customer ? <FieldDescription>{customer.email} · {customer.address}</FieldDescription> : null}
          <FieldError id={form.errorId('customer')}>{errors.customer}</FieldError>
        </Field>
        <div className='grid grid-cols-2 gap-4'>
          <Field>
            <FieldLabel htmlFor={form.id('currency')}>Currency</FieldLabel>
            <Select value={values.currency} onValueChange={(currency) => form.setValue('currency', currency)}>
              <SelectTrigger id={form.id('currency')} className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent position='popper'>
                {Object.keys(currencies).map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor={form.id('terms')}>Terms</FieldLabel>
            <Select value={values.terms} onValueChange={(term) => form.setValues((current) => ({ ...current, terms: term, due: addDays(current.issue, terms[term].days) }))}>
              <SelectTrigger id={form.id('terms')} className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent position='popper'>
                {Object.entries(terms).map(([key, term]) => <SelectItem key={key} value={key}>{term.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <DateField id={form.id('issue')} label='Issued' value={values.issue} onChange={(issue) => form.setValues((current) => ({ ...current, issue, due: addDays(issue, terms[current.terms].days) }))} />
          <DateField id={form.id('due')} label='Due' value={values.due} onChange={(due) => form.setValue('due', due)} invalid={errors.due} describedBy={errors.due ? form.errorId('due') : undefined} />
          <FieldError id={form.errorId('due')} className='col-span-2'>{errors.due}</FieldError>
        </div>
      </div>
      <section aria-labelledby='invoice-items-title' className='grid min-w-0 gap-2'>
        <h3 id='invoice-items-title' className='text-sm font-semibold'>Line items</h3>
        <Table containerProps={{ id: form.id('items'), role: 'region', 'aria-labelledby': 'invoice-items-title', tabIndex: 0, className: 'rounded-md border' }} className='min-w-[36rem]'>
          <TableCaption className='sr-only'>Line items, amounts in {values.currency}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope='col' className='text-start'>Description</TableHead>
              <TableHead scope='col' className='w-24 text-end'>Qty</TableHead>
              <TableHead scope='col' className='w-32 text-end'>Rate</TableHead>
              <TableHead scope='col' className='w-28 text-end'>Amount</TableHead>
              <TableHead scope='col' className='w-10'><span className='sr-only'>Remove</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input aria-label={`Line ${index + 1} description`} value={item.description} aria-invalid={errors.items && !item.description.trim() ? true : undefined} onChange={(event) => updateItem(item.id, { description: event.target.value })} />
                </TableCell>
                <TableCell>
                  <NumberField min={0} value={(item.quantity) === '' || !Number.isFinite(Number(item.quantity)) ? null : Number(item.quantity)} onValueChange={(value) => updateItem(item.id, { quantity: (value ?? NaN) })}>
                    <NumberFieldGroup>
                      <NumberFieldInput aria-label={`Line ${index + 1} quantity`} className='text-end tabular-nums' />
                    </NumberFieldGroup>
                  </NumberField>
                </TableCell>
                <TableCell>
                  <NumberField min={0} step={0.01} value={(item.rate) === '' || !Number.isFinite(Number(item.rate)) ? null : Number(item.rate)} onValueChange={(value) => updateItem(item.id, { rate: (value ?? NaN) })}>
                    <NumberFieldGroup>
                      <InputGroupAddon><InputGroupText>{symbol}</InputGroupText></InputGroupAddon>
                      <NumberFieldInput aria-label={`Line ${index + 1} rate`} className='text-end tabular-nums' />
                    </NumberFieldGroup>
                  </NumberField>
                </TableCell>
                <TableCell className='text-end tabular-nums'>{money((Number(item.quantity) || 0) * (Number(item.rate) || 0))}</TableCell>
                <TableCell>
                  <Button type='button' size='icon-sm' variant='ghost' tone='neutral' aria-label={`Remove line ${index + 1}`} onClick={() => form.setValue('items', values.items.filter((row) => row.id !== item.id))}>
                    <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <FieldError id={form.errorId('items')}>{errors.items}</FieldError>
        <Button type='button' size='sm' variant='outline' tone='neutral' className='justify-self-start' onClick={() => form.setValue('items', [...values.items, { id: nextId++, description: '', quantity: 1, rate: 0 }])}>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
          Add line
        </Button>
      </section>
      <div className='grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_18rem]'>
        <Field>
          <FieldLabel htmlFor={form.id('notes')}>Notes for the customer</FieldLabel>
          <Textarea {...form.field('notes')} rows={4} />
        </Field>
        <div className='bg-surface-muted grid gap-3 rounded-md border p-4'>
          <div className='grid grid-cols-[6rem_minmax(0,1fr)] gap-3'>
            <Field data-invalid={errors.discount ? true : undefined}>
              <FieldLabel htmlFor={form.id('discount')}>Discount</FieldLabel>
              <NumberField id={form.id('discount')} name='discount' value={values.discount === '' ? null : Number(values.discount)} onValueChange={(value) => form.setValue('discount', value ?? '')} min={0} max={100}>
                <NumberFieldGroup>
                  <NumberFieldInput onBlur={form.field('discount').onBlur} aria-invalid={Boolean(errors.discount) || undefined} aria-describedby={form.field('discount')['aria-describedby']} />
                  <InputGroupAddon align='inline-end'><InputGroupText>%</InputGroupText></InputGroupAddon>
                </NumberFieldGroup>
              </NumberField>
            </Field>
            <Field>
              <FieldLabel htmlFor={form.id('tax')}>Tax</FieldLabel>
              <Select value={values.tax} onValueChange={(rate) => form.setValue('tax', rate)}>
                <SelectTrigger id={form.id('tax')} className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  {Object.entries(taxes).map(([rate, label]) => <SelectItem key={rate} value={rate}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <FieldError id={form.errorId('discount')}>{errors.discount}</FieldError>
          <Separator />
          <dl aria-live='polite' className='grid gap-1 text-sm'>
            <div className='flex justify-between'><dt className='text-text-muted'>Subtotal</dt><dd className='tabular-nums'>{money(subtotal)}</dd></div>
            <div className='flex justify-between'><dt className='text-text-muted'>Discount ({Number(values.discount) || 0}%)</dt><dd className='tabular-nums'>−{money(discount)}</dd></div>
            <div className='flex justify-between'><dt className='text-text-muted'>Tax</dt><dd className='tabular-nums'>{money(tax)}</dd></div>
            <div className='flex justify-between border-t pt-2 text-base font-semibold'><dt>Total due {format(values.due, 'd MMM')}</dt><dd className='tabular-nums'>{money(total)}</dd></div>
          </dl>
        </div>
      </div>
      <div className='flex flex-wrap justify-end gap-2 border-t pt-4'>
        <Button type='button' variant='outline' tone='neutral' onClick={() => setStatus('Draft saved')}>Save draft</Button>
        <Button type='submit'>
          <RegistryIcon lucide='SendIcon' aria-hidden='true' />
          Send invoice
        </Button>
      </div>
    </form>
  );
}

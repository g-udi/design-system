'use client';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { default as Field, FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { default as Wizard } from '@gaudi/design-system/blocks/Wizard';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';

const steps = [
  { id: 'client', label: 'Client' },
  { id: 'items', label: 'Line items' },
  { id: 'message', label: 'Message' },
  { id: 'send', label: 'Review and send' }
];
const clients = ['Northwind Traders', 'Fabrikam Studio', 'Kestrel Kites'];
const money = (value) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
let nextId = 3;

export function Pattern() {
  const [client, setClient] = useState(clients[0]);
  const [due, setDue] = useState('Net 14');
  const [items, setItems] = useState([
    { id: 1, description: 'Design system audit', qty: 1, price: 2400 },
    { id: 2, description: 'Component workshops', qty: 3, price: 650 }
  ]);
  const [discount, setDiscount] = useState(10);
  const [tax, setTax] = useState(20);
  const [message, setMessage] = useState('Thanks for working with us. Payment details are on the invoice.');
  const [checked, setChecked] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  const discountAmount = subtotal * (Number(discount) || 0) / 100;
  const taxAmount = (subtotal - discountAmount) * (Number(tax) || 0) / 100;
  const total = subtotal - discountAmount + taxAmount;
  const itemsValid = items.length > 0 && items.every((item) => item.description.trim() && Number(item.qty) > 0);
  const edit = (id, key) => (event) => setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: event.target.value } : item)));
  const updateItemValue = (id, key, value) => setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  const totals = (
    <dl className='ms-auto grid w-full max-w-64 gap-1.5 text-sm'>
      {[['Subtotal', money(subtotal)], [`Discount ${discount || 0}%`, `−${money(discountAmount)}`], [`Tax ${tax || 0}%`, money(taxAmount)]].map(([term, value]) => (
        <div key={term} className='flex justify-between gap-3'>
          <dt className='text-text-muted'>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <div className='flex justify-between gap-3 border-t pt-1.5 font-semibold'>
        <dt>Total</dt>
        <dd aria-live='polite'>{money(total)}</dd>
      </div>
    </dl>
  );
  return (
    <div className='w-full max-w-3xl rounded-xl border p-5'>
      <Wizard
        title='New invoice'
        description='INV-2026-011'
        steps={steps}
        indicator='progress'
        validateStep={(index) => {
          const ok = index !== 1 || itemsValid;
          if (!ok) setChecked(true);
          return ok;
        }}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
        completeLabel='Send invoice'
        completionTitle='Invoice sent'
        completionDescription={`${client} will get ${money(total)} due ${due.toLowerCase()}.`}
      >
        {(step) =>
          step === 0 ? (
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field>
                <FieldLabel htmlFor='invoice-client'>Bill to</FieldLabel>
                <NativeSelect id='invoice-client' value={client} onChange={(event) => setClient(event.target.value)} className='w-full'>
                  {clients.map((name) => <NativeSelectOption key={name} value={name}>{name}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor='invoice-due'>Payment terms</FieldLabel>
                <NativeSelect id='invoice-due' value={due} onChange={(event) => setDue(event.target.value)} className='w-full'>
                  {['Due on receipt', 'Net 14', 'Net 30'].map((term) => <NativeSelectOption key={term} value={term}>{term}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
          ) : step === 1 ? (
            <div className='grid gap-4'>
              <Table containerProps={{ role: 'region', 'aria-label': 'Line items', tabIndex: 0 }} className='min-w-[34rem]'>
                <TableCaption className='sr-only'>Line items</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope='col' className='text-left'>Description</TableHead>
                    <TableHead scope='col' className='w-20 text-left'>Qty</TableHead>
                    <TableHead scope='col' className='w-28 text-left'>Price</TableHead>
                    <TableHead scope='col' className='w-28 text-right'>Amount</TableHead>
                    <TableHead scope='col' className='w-8'><span className='sr-only'>Remove</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input aria-label={`Item ${index + 1} description`} value={item.description} invalid={checked && !item.description.trim()} onChange={edit(item.id, 'description')} />
                      </TableCell>
                      <TableCell>
                        <NumberField min={1} value={(item.qty) === '' || !Number.isFinite(Number(item.qty)) ? null : Number(item.qty)} onValueChange={(value) => updateItemValue(item.id, 'qty', value ?? '')}>
                          <NumberFieldGroup>
                            <NumberFieldInput aria-label={`Item ${index + 1} quantity`} invalid={checked && !(Number(item.qty) > 0)} />
                          </NumberFieldGroup>
                        </NumberField>
                      </TableCell>
                      <TableCell>
                        <NumberField min={0} value={(item.price) === '' || !Number.isFinite(Number(item.price)) ? null : Number(item.price)} onValueChange={(value) => updateItemValue(item.id, 'price', value ?? '')}>
                          <NumberFieldGroup>
                            <NumberFieldInput aria-label={`Item ${index + 1} price`} />
                          </NumberFieldGroup>
                        </NumberField>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>{money((Number(item.qty) || 0) * (Number(item.price) || 0))}</TableCell>
                      <TableCell className='text-right'>
                        <Button size='icon-xs' variant='ghost' aria-label={`Remove item ${index + 1}`} onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}>
                          <RegistryIcon lucide='XIcon' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button size='sm' variant='outline' className='justify-self-start' onClick={() => setItems((current) => [...current, { id: nextId++, description: '', qty: 1, price: 0 }])}>
                <RegistryIcon lucide='PlusIcon' />
                Add line item
              </Button>
              {checked && !itemsValid ? <p role='alert' className='text-danger text-sm'>Every line needs a description and a quantity.</p> : null}
              <div className='flex flex-wrap items-end justify-between gap-4'>
                <div className='flex gap-3'>
                  <Field className='w-28'>
                    <FieldLabel>Discount %</FieldLabel>
                    <NumberField min={0} max={100} value={(discount) === '' || !Number.isFinite(Number(discount)) ? null : Number(discount)} onValueChange={(value) => setDiscount((value ?? ''))}>
                      <NumberFieldGroup>
                        <NumberFieldInput />
                      </NumberFieldGroup>
                    </NumberField>
                  </Field>
                  <Field className='w-28'>
                    <FieldLabel>Tax %</FieldLabel>
                    <NumberField min={0} max={50} value={(tax) === '' || !Number.isFinite(Number(tax)) ? null : Number(tax)} onValueChange={(value) => setTax((value ?? ''))}>
                      <NumberFieldGroup>
                        <NumberFieldInput />
                      </NumberFieldGroup>
                    </NumberField>
                  </Field>
                </div>
                {totals}
              </div>
            </div>
          ) : step === 2 ? (
            <div className='grid gap-4'>
              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Input defaultValue={`Invoice INV-2026-011 from Gaudi Studio`} />
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value)} />
                <FieldError>{message.length > 400 ? 'Keep the message under 400 characters.' : null}</FieldError>
              </Field>
            </div>
          ) : (
            <div className='grid gap-4 text-sm'>
              <p>
                <span className='text-text-muted'>To </span>
                <span className='font-medium'>{client}</span>
                <span className='text-text-muted'> · {due} · {items.length} line {items.length === 1 ? 'item' : 'items'}</span>
              </p>
              <blockquote className='bg-surface-muted rounded-md border px-3 py-2'>{message}</blockquote>
              {totals}
            </div>
          )
        }
      </Wizard>
    </div>
  );
}

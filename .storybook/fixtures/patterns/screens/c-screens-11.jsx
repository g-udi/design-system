'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { default as Field, FieldError, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const steps = [
  { id: 'client', label: 'Client' },
  { id: 'items', label: 'Line items' },
  { id: 'message', label: 'Message' },
  { id: 'send', label: 'Review and send' }
];
const clients = ['Northwind Traders', 'Fabrikam Studio', 'Tailspin Toys'];
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
              <div className='relative overflow-x-auto'>
                <table className='w-full min-w-[34rem] text-sm'>
                  <caption className='sr-only'>Line items</caption>
                  <thead className='text-text-muted text-xs'>
                    <tr>
                      <th className='pb-2 text-left font-medium'>Description</th>
                      <th className='w-20 pb-2 text-left font-medium'>Qty</th>
                      <th className='w-28 pb-2 text-left font-medium'>Price</th>
                      <th className='w-28 pb-2 text-right font-medium'>Amount</th>
                      <th className='w-8 pb-2'><span className='sr-only'>Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className='border-t'>
                        <td className='py-2 pe-2'>
                          <Input aria-label={`Item ${index + 1} description`} value={item.description} invalid={checked && !item.description.trim()} onChange={edit(item.id, 'description')} />
                        </td>
                        <td className='py-2 pe-2'>
                          <Input aria-label={`Item ${index + 1} quantity`} type='number' min={1} value={item.qty} invalid={checked && !(Number(item.qty) > 0)} onChange={edit(item.id, 'qty')} />
                        </td>
                        <td className='py-2 pe-2'>
                          <Input aria-label={`Item ${index + 1} price`} type='number' min={0} value={item.price} onChange={edit(item.id, 'price')} />
                        </td>
                        <td className='py-2 text-right tabular-nums'>{money((Number(item.qty) || 0) * (Number(item.price) || 0))}</td>
                        <td className='py-2 ps-1 text-right'>
                          <Button size='icon-xs' variant='ghost' aria-label={`Remove item ${index + 1}`} onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}>
                            <RegistryIcon lucide='XIcon' />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button size='sm' variant='outline' className='justify-self-start' onClick={() => setItems((current) => [...current, { id: nextId++, description: '', qty: 1, price: 0 }])}>
                <RegistryIcon lucide='PlusIcon' />
                Add line item
              </Button>
              {checked && !itemsValid ? <p role='alert' className='text-danger text-sm'>Every line needs a description and a quantity.</p> : null}
              <div className='flex flex-wrap items-end justify-between gap-4'>
                <div className='flex gap-3'>
                  <Field className='w-28'>
                    <FieldLabel>Discount %</FieldLabel>
                    <Input type='number' min={0} max={100} value={discount} onChange={(event) => setDiscount(event.target.value)} />
                  </Field>
                  <Field className='w-28'>
                    <FieldLabel>Tax %</FieldLabel>
                    <Input type='number' min={0} max={50} value={tax} onChange={(event) => setTax(event.target.value)} />
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

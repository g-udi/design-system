'use client';
import { useState } from 'react';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../../../../src/components/core/Select/parts/combobox.jsx';
import { default as Field, FieldDescription, FieldError, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Alert, AlertDescription, AlertTitle } from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const steps = [
  { id: 'payee', label: 'Payee' },
  { id: 'amount', label: 'Amount' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'confirm', label: 'Confirm' }
];
const payees = ['Ana Ruiz · ES91 2100 0418 4502 0005 1332', 'Fabrikam Studio GmbH · DE89 3704 0044 0532 0130 00', 'Li Wei · GB29 NWBK 6016 1331 9268 19', 'Tailspin Toys Ltd · GB82 WEST 1234 5698 7654 32'];
// Rates are against the euro, the currency of the source account.
const currencies = { 'EUR · Euro': 1, 'GBP · British pound': 0.86, 'USD · US dollar': 1.08, 'CHF · Swiss franc': 0.95 };
const balance = 4280.5;
const fee = 1.5;
const euro = (value) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);

export function Pattern() {
  const [payee, setPayee] = useState(null);
  const [currency, setCurrency] = useState('EUR · Euro');
  const [amount, setAmount] = useState('');
  const [when, setWhen] = useState('now');
  const [checked, setChecked] = useState({});
  const rate = currencies[currency] || 1;
  const debit = (Number(amount) || 0) / rate + fee;
  const errors = {
    payee: !payee && 'Choose who to pay.',
    amount: !(Number(amount) > 0) ? 'Enter an amount.' : debit > balance ? `That is ${euro(debit - balance)} more than the available balance.` : ''
  };
  const keys = ['payee', 'amount'];
  return (
    <div className='w-full max-w-xl rounded-xl border p-5'>
      <Wizard
        title='Send money'
        description={`From Main account · ${euro(balance)} available`}
        steps={steps}
        indicator='dots'
        navigable
        validateStep={(index) => {
          const key = keys[index];
          if (!key) return true;
          setChecked((current) => ({ ...current, [key]: true }));
          return !errors[key];
        }}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
        completeLabel={`Send ${amount || 0} ${currency.slice(0, 3)}`}
        completionTitle='Transfer on its way'
        completionDescription={when === 'now' ? 'It usually arrives within a few minutes.' : 'We send it on the first of next month.'}
      >
        {(step) =>
          step === 0 ? (
            <Field>
              <FieldLabel htmlFor='transfer-payee'>Pay to</FieldLabel>
              <Combobox items={payees} value={payee} onValueChange={setPayee}>
                <ComboboxInput id='transfer-payee' placeholder='Search people and companies' aria-invalid={checked.payee && errors.payee ? true : undefined} />
                <ComboboxContent>
                  <ComboboxEmpty>No saved payees match.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldDescription>Saved payees, searchable by name or IBAN.</FieldDescription>
              <FieldError>{checked.payee && errors.payee ? errors.payee : null}</FieldError>
            </Field>
          ) : step === 1 ? (
            <div className='grid gap-4'>
              <div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]'>
                <Field>
                  <FieldLabel>Amount</FieldLabel>
                  <Input type='number' min={0} step='0.01' inputMode='decimal' value={amount} invalid={Boolean(checked.amount && errors.amount)} onChange={(event) => setAmount(event.target.value)} />
                  <FieldError>{checked.amount && errors.amount ? errors.amount : null}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor='transfer-currency'>Currency</FieldLabel>
                  <Combobox items={Object.keys(currencies)} value={currency} onValueChange={(next) => setCurrency(next || currency)}>
                    <ComboboxInput id='transfer-currency' />
                    <ComboboxContent>
                      <ComboboxEmpty>No currency found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </Field>
              </div>
              <dl className='bg-surface-muted grid gap-1.5 rounded-lg border p-3 text-sm'>
                <div className='flex justify-between gap-3'><dt className='text-text-muted'>Rate</dt><dd>1 EUR = {rate} {currency.slice(0, 3)}</dd></div>
                <div className='flex justify-between gap-3'><dt className='text-text-muted'>Fee</dt><dd>{euro(fee)}</dd></div>
                <div className='flex justify-between gap-3 font-medium'><dt>Taken from your account</dt><dd aria-live='polite'>{euro(Number(amount) > 0 ? debit : 0)}</dd></div>
                <div className='flex justify-between gap-3'><dt className='text-text-muted'>Balance after</dt><dd className={debit > balance ? 'text-danger' : undefined}>{euro(balance - (Number(amount) > 0 ? debit : 0))}</dd></div>
              </dl>
            </div>
          ) : step === 2 ? (
            <RadioGroup
              label='When should it go?'
              variant='cards'
              value={when}
              onValueChange={setWhen}
              options={[
                { value: 'now', label: 'Now', description: 'Instant where the bank supports it.' },
                { value: 'monthly', label: 'Every month', description: 'On the 1st, until you cancel.' }
              ]}
            />
          ) : (
            <div className='grid gap-4 text-sm'>
              <dl className='grid gap-3'>
                {[['To', payee], ['They get', `${amount} ${currency.slice(0, 3)}`], ['You pay', euro(debit)], ['When', when === 'now' ? 'Now' : 'Monthly on the 1st']].map(([term, value]) => (
                  <div key={term} className='flex justify-between gap-3 border-b pb-3'>
                    <dt className='text-text-muted'>{term}</dt>
                    <dd className='min-w-0 truncate text-end font-medium'>{value}</dd>
                  </div>
                ))}
              </dl>
              <Alert variant='info'>
                <RegistryIcon lucide='ShieldCheckIcon' />
                <AlertTitle>Check the payee name</AlertTitle>
                <AlertDescription>Transfers to a new account cannot be recalled once sent.</AlertDescription>
              </Alert>
            </div>
          )
        }
      </Wizard>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import { default as Field, FieldDescription, FieldError, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';

const steps = [
  { id: 'company', label: 'Company', description: 'Legal entity' },
  { id: 'banking', label: 'Banking', description: 'Where we pay you' },
  { id: 'review', label: 'Review', description: 'Confirm and submit' }
];
const ibanPattern = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;
const vatPattern = /^[A-Z]{2}[A-Z0-9]{8,12}$/;

export function Pattern() {
  const [vendor, setVendor] = useState({ name: 'Fabrikam Studio GmbH', vat: '', country: 'DE', iban: '', terms: '30', attest: false });
  const [checked, setChecked] = useState({});
  const set = (key) => (event) => setVendor((current) => ({ ...current, [key]: event.target.value }));
  const errors = {
    name: !vendor.name.trim() && 'Enter the registered company name.',
    vat: !vatPattern.test(vendor.vat.replace(/\s/g, '').toUpperCase()) && 'Use the country code and number, for example DE123456789.',
    iban: !ibanPattern.test(vendor.iban.replace(/\s/g, '').toUpperCase()) && 'Enter a valid IBAN, for example DE89 3704 0044 0532 0130 00.',
    attest: !vendor.attest && 'Confirm the details before submitting.'
  };
  const fieldsByStep = [['name', 'vat'], ['iban'], ['attest']];
  const show = (key) => checked[key] && errors[key];
  return (
    <div className='w-full max-w-3xl rounded-xl border p-5'>
      <Wizard
        title='Become a supplier'
        description='Procurement reviews new vendors within two working days.'
        steps={steps}
        indicator='vertical'
        navigable
        validateStep={(index) => {
          const keys = fieldsByStep[index];
          setChecked((current) => ({ ...current, ...Object.fromEntries(keys.map((key) => [key, true])) }));
          return keys.every((key) => !errors[key]);
        }}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
        completeLabel='Submit for review'
        completionTitle='Submitted for review'
        completionDescription='We email you once procurement approves the account.'
      >
        {(step) =>
          step === 0 ? (
            <div className='grid gap-4'>
              <Field>
                <FieldLabel>Registered name</FieldLabel>
                <Input value={vendor.name} invalid={Boolean(show('name'))} onChange={set('name')} />
                <FieldError>{show('name') || null}</FieldError>
              </Field>
              <div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]'>
                <Field>
                  <FieldLabel>VAT number</FieldLabel>
                  <Input value={vendor.vat} placeholder='DE123456789' invalid={Boolean(show('vat'))} onChange={set('vat')} />
                  <FieldError>{show('vat') || null}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor='vendor-country'>Country</FieldLabel>
                  <NativeSelect id='vendor-country' value={vendor.country} onChange={set('country')} className='w-full'>
                    {[['DE', 'Germany'], ['FR', 'France'], ['NL', 'Netherlands'], ['GB', 'United Kingdom']].map(([code, name]) => (
                      <NativeSelectOption key={code} value={code}>{name}</NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              </div>
            </div>
          ) : step === 1 ? (
            <div className='grid gap-4'>
              <Field>
                <FieldLabel>IBAN</FieldLabel>
                <Input value={vendor.iban} autoComplete='off' invalid={Boolean(show('iban'))} onChange={set('iban')} />
                <FieldDescription>Payments go out in euros by SEPA transfer.</FieldDescription>
                <FieldError>{show('iban') || null}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor='vendor-terms'>Payment terms</FieldLabel>
                <NativeSelect id='vendor-terms' value={vendor.terms} onChange={set('terms')} className='w-full sm:w-48'>
                  {['14', '30', '45', '60'].map((days) => <NativeSelectOption key={days} value={days}>{days} days</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
          ) : (
            <div className='grid gap-4 text-sm'>
              <dl className='grid gap-3'>
                {[
                  ['Company', `${vendor.name} · ${vendor.country}`],
                  ['VAT number', vendor.vat.toUpperCase()],
                  ['IBAN', `•••• ${vendor.iban.replace(/\s/g, '').slice(-4)}`],
                  ['Terms', `${vendor.terms} days`]
                ].map(([term, value]) => (
                  <div key={term} className='flex justify-between gap-3 border-b pb-3'>
                    <dt className='text-text-muted'>{term}</dt>
                    <dd className='font-medium'>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className='grid gap-1.5'>
                <div className='flex items-start gap-2'>
                  <Checkbox id='vendor-attest' checked={vendor.attest} aria-invalid={show('attest') ? true : undefined} onCheckedChange={(on) => setVendor((current) => ({ ...current, attest: on === true }))} />
                  <Label htmlFor='vendor-attest' className='font-normal'>These details are correct and I can sign for the company.</Label>
                </div>
                {show('attest') ? <p className='text-danger text-sm'>{errors.attest}</p> : null}
              </div>
            </div>
          )
        }
      </Wizard>
    </div>
  );
}

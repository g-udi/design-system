'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const sections = {
  legal: {
    title: 'Legal entity',
    description: 'As it appears on your registration documents.',
    fields: [
      { name: 'company', label: 'Registered name', rules: validators.required('Enter the registered company name.') },
      { name: 'number', label: 'Company number', rules: [validators.required('Enter the company number.'), validators.pattern(/^[A-Z0-9]{8}$/i, 'Company numbers are 8 letters or digits.')], hint: '8 characters, on the certificate of incorporation.' },
      { name: 'type', label: 'Entity type', select: ['Private limited company', 'Sole trader', 'Partnership', 'Charity'] },
      { name: 'address', label: 'Registered address', rules: validators.required('Enter the registered address.') }
    ]
  },
  ownership: {
    title: 'Ownership',
    description: 'Anyone who owns or controls 25% or more.',
    fields: [
      { name: 'owner', label: 'Owner name', rules: validators.required('Enter the owner’s full legal name.') },
      { name: 'share', label: 'Ownership', suffix: '%', rules: [validators.required('Enter the share they own.'), validators.min(25, 'Only list owners with 25% or more.'), validators.max(100, 'A share cannot be over 100%.')] },
      { name: 'born', label: 'Date of birth', type: 'date', rules: validators.required('Enter their date of birth.') }
    ]
  },
  compliance: {
    title: 'Compliance',
    description: 'How you trade and where your customers are.',
    fields: [
      { name: 'activity', label: 'What you sell', rules: [validators.required('Describe what you sell.'), validators.minLength(12, 'Add a little more detail, at least 12 characters.')] },
      { name: 'regions', label: 'Customer regions', select: ['UK only', 'UK and EU', 'Worldwide'] },
      { name: 'volume', label: 'Expected yearly volume', select: ['Under £50k', '£50k–£250k', '£250k–£1m', 'Over £1m'] }
    ]
  }
};
const initial = {
  legal: { company: 'Field Notes Press Ltd', number: '12345678', type: 'Private limited company', address: '4 Old Street, London EC1V 9AA' },
  ownership: { owner: 'Maya Chen', share: '', born: '' },
  compliance: { activity: '', regions: 'UK and EU', volume: 'Under £50k' }
};
const complete = (key, values) => sections[key].fields.every((field) => !field.rules || ![].concat(field.rules).some((rule) => rule(values[field.name], values)));

function EditDialog({ sectionKey, values, onSave }) {
  const section = sections[sectionKey];
  const rules = Object.fromEntries(section.fields.filter((field) => field.rules).map((field) => [field.name, field.rules]));
  const form = useFormValidation({ initialValues: values, rules });
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) form.reset(values);
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm' variant='outline' tone='neutral' aria-label={`Edit ${section.title.toLowerCase()}`}>
          <RegistryIcon lucide='PencilIcon' aria-hidden='true' />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <form
          noValidate
          onSubmit={form.handleSubmit((data) => {
            onSave(data);
            setOpen(false);
          })}
          className='grid gap-4'
        >
          <DialogHeader>
            <DialogTitle>{section.title}</DialogTitle>
            <DialogDescription>{section.description}</DialogDescription>
          </DialogHeader>
          <FormErrorSummary form={form} labels={Object.fromEntries(section.fields.map((field) => [field.name, field.label]))} />
          <FieldGroup className='gap-4'>
            {section.fields.map((field) =>
              field.select ? (
                <Field key={field.name}>
                  <FieldLabel htmlFor={form.id(field.name)}>{field.label}</FieldLabel>
                  <Select value={form.values[field.name]} onValueChange={(value) => form.setValue(field.name, value)}>
                    <SelectTrigger id={form.id(field.name)} className='w-full'><SelectValue /></SelectTrigger>
                    <SelectContent position='popper'>
                      {field.select.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              ) : (
                <Field key={field.name} data-invalid={form.errors[field.name] ? true : undefined}>
                  <FieldLabel htmlFor={form.id(field.name)}>{field.label}</FieldLabel>
                  <Input {...form.field(field.name, { describedBy: field.hint ? form.id(`${field.name}-hint`) : undefined })} type={field.type || 'text'} suffix={field.suffix} />
                  {field.hint ? <FieldDescription id={form.id(`${field.name}-hint`)}>{field.hint}</FieldDescription> : null}
                  <FieldError id={form.errorId(field.name)}>{form.errors[field.name]}</FieldError>
                </Field>
              )
            )}
          </FieldGroup>
          <DialogFooter>
            <Button type='button' variant='ghost' tone='neutral' onClick={() => setOpen(false)}>Cancel</Button>
            <Button type='submit'>Save section</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Pattern() {
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const done = Object.keys(sections).filter((key) => complete(key, data[key]));
  const ready = done.length === Object.keys(sections).length;

  return (
    <div className='mx-auto grid w-full max-w-3xl gap-4'>
      <div className='grid gap-3 rounded-lg border p-5'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='grid gap-1'>
            <h2 className='text-lg font-semibold'>Verify your business</h2>
            <p className='text-text-muted text-sm'>Payouts start once every section is complete and reviewed, usually within one working day.</p>
          </div>
          <Badge variant={submitted ? 'info-light' : ready ? 'success-light' : 'warning-light'} aria-live='polite'>
            {submitted ? 'In review' : `${done.length} of 3 complete`}
          </Badge>
        </div>
        <Progress value={(done.length / 3) * 100} aria-label='Verification sections complete' />
      </div>
      {Object.entries(sections).map(([key, section]) => {
        const ok = complete(key, data[key]);
        return (
          <section key={key} aria-labelledby={`verification-${key}`} className='grid gap-3 rounded-lg border p-5'>
            <div className='flex flex-wrap items-center gap-3'>
              <h3 id={`verification-${key}`} className='text-sm font-semibold'>{section.title}</h3>
              <Badge size='sm' variant={ok ? 'success-light' : 'attention-light'}>
                <RegistryIcon lucide={ok ? 'CircleCheckIcon' : 'CircleAlertIcon'} aria-hidden='true' />
                {ok ? 'Complete' : 'Needs information'}
              </Badge>
              <span className='ms-auto'>
                {submitted ? null : <EditDialog sectionKey={key} values={data[key]} onSave={(values) => setData((current) => ({ ...current, [key]: values }))} />}
              </span>
            </div>
            <dl className='grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[12rem_minmax(0,1fr)]'>
              {section.fields.map((field) => (
                <div key={field.name} className='contents'>
                  <dt className='text-text-muted'>{field.label}</dt>
                  <dd className={data[key][field.name] ? 'break-words' : 'text-attention'}>
                    {data[key][field.name] ? `${data[key][field.name]}${field.suffix || ''}` : 'Missing'}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
      <div className='flex flex-wrap items-center justify-end gap-3'>
        {!ready ? <p className='text-text-muted text-sm'>Complete every section to submit.</p> : null}
        <Button disabled={!ready || submitted} onClick={() => setSubmitted(true)}>{submitted ? 'Submitted for review' : 'Submit for review'}</Button>
      </div>
    </div>
  );
}

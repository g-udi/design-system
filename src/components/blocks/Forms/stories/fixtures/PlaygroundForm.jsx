import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { FieldRoot as Field, FieldContent, FieldDescriptionPrimitive as FieldDescription, FieldErrorPrimitive as FieldError, FieldGroup, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import Input from '@gaudi/design-system/core/Input';
import Textarea from '@gaudi/design-system/core/Textarea';
import { CharacterCount, EditableField, FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';
import { EmailInput } from '@gaudi/design-system/core/Input';

export const labels = { name: 'Name', email: 'Email', message: 'Message' };

export function Row({ layout, label, htmlFor, aside, error, errorId, children }) {
  const head = (
    <div className='flex items-baseline justify-between gap-3'>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {aside}
    </div>
  );
  return (
    <Field orientation={layout === 'rows' ? 'responsive' : 'vertical'} data-invalid={error ? true : undefined}>
      {layout === 'rows' ? <FieldContent className='@md/field-group:max-w-48'>{head}</FieldContent> : head}
      <div className='grid min-w-0 gap-1.5 @md/field-group:w-full!'>
        {children}
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    </Field>
  );
}

export function PlaygroundForm({ validateOn, layout, showSummary, maxLength, summaryTitle, editable }) {
  const max = Number(maxLength);
  const form = useFormValidation({
    initialValues: { name: '', email: '', message: '' },
    rules: {
      name: validators.required('Enter your name.'),
      email: [validators.required('Enter your email address.'), validators.email()],
      message: [validators.required('Write a message.'), validators.maxLength(max)]
    },
    validateOn
  });
  const [displayName, setDisplayName] = useState('Mei Castellanos');
  const [sent, setSent] = useState(false);
  const { errors, values } = form;
  return (
    <form noValidate aria-label='Contact' onSubmit={form.handleSubmit(() => setSent(true))} className='grid w-full max-w-xl gap-4'>
      {showSummary ? <FormErrorSummary form={form} labels={labels} title={summaryTitle || undefined} /> : null}
      <FieldDescription>{validateOn === 'blur' ? 'Errors appear when you leave a field and update as you type.' : 'Errors appear when you submit the form.'}</FieldDescription>
      <FieldGroup className='gap-4'>
        <Row layout={layout} label='Name' htmlFor={form.id('name')} error={errors.name} errorId={form.errorId('name')}>
          <Input {...form.field('name')} autoComplete='name' />
        </Row>
        <Row layout={layout} label='Email' htmlFor={form.id('email')} error={errors.email} errorId={form.errorId('email')}>
          <EmailInput {...form.field('email')}  autoComplete='email' />
        </Row>
        <Row
          layout={layout}
          label='Message'
          htmlFor={form.id('message')}
          aside={<CharacterCount id={form.id('count')} value={values.message} max={max} />}
          error={errors.message}
          errorId={form.errorId('message')}
        >
          <Textarea {...form.field('message', { describedBy: form.id('count') })} rows={3} />
        </Row>
      </FieldGroup>
      {editable ? (
        <div className='border-y'>
          <EditableField label='Display name' value={displayName} onSave={setDisplayName} validate={validators.required('The display name cannot be empty.')} />
        </div>
      ) : null}
      <div className='flex items-center justify-end gap-3'>
        {sent ? <p role='status' className='text-success me-auto text-sm'>Message sent.</p> : null}
        <Button type='submit'>Send</Button>
      </div>
    </form>
  );
}

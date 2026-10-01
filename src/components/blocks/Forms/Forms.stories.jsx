import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../../core/Button';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../../core/Field/parts/field.jsx';
import Input from '../../core/Input';
import Textarea from '../../core/Textarea';
import { CharacterCount, EditableField, FormErrorSummary, useFormValidation, validators } from './Forms';

const docs = getComponentDocs('Blocks/Forms');
const labels = { name: 'Name', email: 'Email', message: 'Message' };

function Row({ layout, label, htmlFor, aside, error, errorId, children }) {
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

function PlaygroundForm({ validateOn, layout, showSummary, maxLength, summaryTitle, editable }) {
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
  const [displayName, setDisplayName] = useState('Maya Chen');
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
          <Input {...form.field('email')} type='email' autoComplete='email' />
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

export default {
  title: 'Blocks/Forms',
  id: 'blocks-forms',
  component: FormErrorSummary,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    validateOn: ['blur', 'submit'],
    layout: ['stacked', 'rows'],
    showSummary: 'boolean',
    maxLength: ['140', '280', '600'],
    summaryTitle: 'text',
    editable: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { validateOn: 'blur', layout: 'stacked', showSummary: true, maxLength: '280', summaryTitle: '', editable: true },
  parameters: {
    docs: {
      description: {
        story: 'A contact form wired with useFormValidation. `validateOn` chooses whether errors appear on blur or only on submit, `layout` switches stacked fields for label-control rows, `showSummary` adds the FormErrorSummary that takes focus after a failed submit, `maxLength` drives the message limit and its CharacterCount, and `editable` adds an EditableField row.'
      },
      source: playgroundSource('FormErrorSummary', {
        imports: "import { CharacterCount, EditableField, FormErrorSummary, useFormValidation, validators } from '@gaudi/design-system/blocks/Forms';",
        before: "const form = useFormValidation({\n  initialValues: { name: '', email: '', message: '' },\n  rules: { name: validators.required(), email: [validators.required(), validators.email()], message: validators.maxLength(280) }\n});\n\n<form noValidate onSubmit={form.handleSubmit(send)}>\n  ",
        attributes: ['form={form}', "labels={{ name: 'Name', email: 'Email', message: 'Message' }}"],
        after: "\n  <Input {...form.field('email')} type='email' />\n  <FieldError id={form.errorId('email')}>{form.errors.email}</FieldError>\n</form>"
      })
    }
  },
  render: (args) => <PlaygroundForm {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    // A failed submit lists every problem and moves focus to the summary.
    const summary = await canvas.findByRole('alert', { name: /Fix 3 problems/ });
    await waitFor(() => expect(summary).toHaveFocus());
    await userEvent.click(within(summary).getByRole('link', { name: /Email/ }));
    const email = canvas.getByLabelText('Email');
    await expect(email).toHaveFocus();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(email, 'maya@example.com');
    await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid'));
    // EditableField: Escape cancels and returns focus to Edit.
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Display name' }));
    const control = canvas.getByLabelText('Display name');
    await userEvent.clear(control);
    await userEvent.type(control, 'Maya C.{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit Display name' })).toHaveFocus());
    await expect(canvas.getByText('Maya C.')).toBeVisible();
  }
};

import { useId } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { Field, FieldDescription, FieldError, FieldInput, FieldLabel } from '../Field';
import { EmailInput } from '../../Input/index.js';

const docs = getComponentDocs('Core/Field');
const email = { label: 'Email', description: 'Used for article updates only.', error: 'Enter an address like you@example.com.' };
// A sign-up form: a filled name, a handle that failed validation, a textarea, and an email field driven by the controls.
const profile = { name: 'Odile Marchetti', handle: 'ada', handleError: 'That handle is taken. Try ada-lovelace.' };
const emailInput = (canvas) => canvas.getByRole('textbox', { name: new RegExp(`^${email.label}`) });

export default {
  title: 'Core/Field',
  id: 'core-field',
  component: Field,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { placeholder: 'text', required: 'boolean', invalid: 'boolean', disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { placeholder: 'you@example.com', required: true, invalid: false, disabled: false },
  parameters: {
    docs: {
      description: { story: 'A sign-up form with a filled name, a handle that failed validation, and a textarea bio. The email field follows the controls: `required` adds the marker, `invalid` shows the error, and `disabled` locks the input.' },
      source: {
        type: 'code',
        language: 'jsx',
        transform: (_source, { args }) => previewSource('EmailInput', args, {
          imports: "import { Field, FieldDescription, FieldError, EmailInput, FieldLabel } from '@gaudi/design-system';",
          before: `<Field>\n<FieldLabel>${email.label}</FieldLabel>\n`,
          after: `\n<FieldDescription>${email.description}</FieldDescription>${args.invalid ? `\n<FieldError>${email.error}</FieldError>` : ''}\n</Field>`
        })
      }
    }
  },
  render: function Render(args) {
    const id = useId();
    return (
    <form className='grid gap-5' onSubmit={(event) => event.preventDefault()}>
      <div className='grid gap-5'>
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <FieldInput defaultValue={profile.name} autoComplete='name' />
        </Field>
        <Field>
          <FieldLabel>Handle</FieldLabel>
          <FieldInput defaultValue={profile.handle} autoComplete='username' />
          <FieldError id={`${id}-handle-error`}>{profile.handleError}</FieldError>
        </Field>
      </div>
      <Field>
        <FieldLabel className='flex items-baseline justify-between gap-2'>
          {email.label}
          <span className='text-xs font-normal text-text-muted'>{args.required ? 'Required' : 'Optional'}</span>
        </FieldLabel>
        <EmailInput  autoComplete='email' {...args} />
        <FieldDescription id={`${id}-email-help`}>{email.description}</FieldDescription>
        {args.invalid ? <FieldError>{email.error}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel>Bio</FieldLabel>
        <FieldInput as='textarea' rows={3} placeholder='A sentence or two for your author page.' />
        <FieldDescription>Shown under your name on every article.</FieldDescription>
      </Field>
    </form>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('textbox', { name: 'Handle' });
    await expect(handle).toHaveAttribute('aria-invalid', 'true');
    await expect(handle).toHaveAccessibleDescription(profile.handleError);
    await expect(handle).toHaveValue(profile.handle);

    const input = emailInput(canvas);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveAttribute('placeholder', args.placeholder);
    await expect(canvas.getByText(args.required ? 'Required' : 'Optional')).toBeVisible();
    if (args.required) await expect(input).toBeRequired();
    const description = args.invalid ? `${email.description} ${email.error}` : email.description;
    await expect(input).toHaveAccessibleDescription(description);
    if (args.invalid) await expect(input).toHaveAttribute('aria-invalid', 'true');
    else await expect(input).not.toHaveAttribute('aria-invalid');

    if (args.disabled) {
      await expect(input).toBeDisabled();
      return;
    }
    await userEvent.click(input.labels[0]);
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'reader@example.com');
    await expect(input).toHaveValue('reader@example.com');
  }
};

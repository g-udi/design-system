import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Field, FieldDescription, FieldError, FieldInput, FieldLabel } from './Field';

const docs = getComponentDocs('Core/Field');
const email = { label: 'Email', description: 'Used for article updates only.', error: 'Enter an address like you@example.com.' };
// A sign-up form: a filled name, a handle that failed validation, a textarea, and an email field driven by the controls.
const profile = { name: 'Ada Lovelace', handle: 'ada', handleError: 'That handle is taken. Try ada-lovelace.' };
const emailInput = (canvas) => canvas.getByRole('textbox', { name: new RegExp(`^${email.label}`) });

export default {
  title: 'Core/Inputs/Field',
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
      source: playgroundSource('FieldInput', {
        imports: "import { Field, FieldDescription, FieldError, FieldInput, FieldLabel } from '@gaudi/design-system';",
        attributes: ["type='email'"],
        before: `<Field>\n<FieldLabel>${email.label}</FieldLabel>\n`,
        after: `\n<FieldDescription>${email.description}</FieldDescription>\n{invalid ? <FieldError>${email.error}</FieldError> : null}\n</Field>`
      })
    }
  },
  render: (args) => (
    <form className='grid gap-5' onSubmit={(event) => event.preventDefault()}>
      <div className='grid items-start gap-5 sm:grid-cols-2'>
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <FieldInput defaultValue={profile.name} autoComplete='name' />
        </Field>
        <Field>
          <FieldLabel>Handle</FieldLabel>
          <FieldInput defaultValue={profile.handle} autoComplete='username' />
          <FieldError>{profile.handleError}</FieldError>
        </Field>
      </div>
      <Field>
        <FieldLabel className='flex items-baseline justify-between gap-2'>
          {email.label}
          <span className='text-xs font-normal text-gray-500 dark:text-gray-400'>{args.required ? 'Required' : 'Optional'}</span>
        </FieldLabel>
        <FieldInput type='email' autoComplete='email' {...args} />
        <FieldDescription>{email.description}</FieldDescription>
        {args.invalid ? <FieldError>{email.error}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel>Bio</FieldLabel>
        <FieldInput as='textarea' rows={3} className='min-h-20 py-2' placeholder='A sentence or two for your author page.' />
        <FieldDescription>Shown under your name on every article.</FieldDescription>
      </Field>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('textbox', { name: 'Handle' });
    await expect(handle).toHaveAttribute('aria-invalid', 'true');
    await expect(handle).toHaveAccessibleDescription(profile.handleError);
    await expect(handle).toHaveValue(profile.handle);

    const input = emailInput(canvas);
    await expect(input).toHaveAttribute('type', 'email');
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

export const Disabled = {
  parameters: {
    docs: { description: { story: 'A disabled, read-only value stays labelled and described but cannot be focused or edited.' } }
  },
  render: () => (
    <Field>
      <FieldLabel>{email.label}</FieldLabel>
      <FieldInput type='email' value='editor@example.com' disabled readOnly />
      <FieldDescription>This value is managed by account settings.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(email.label);
    await expect(input).toBeDisabled();
    await userEvent.click(canvas.getByText(email.label));
    await expect(input).not.toHaveFocus();
    await userEvent.type(input, 'changed@example.com');
    await expect(input).toHaveValue('editor@example.com');
  }
};

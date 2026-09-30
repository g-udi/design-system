import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Field, FieldDescription, FieldError, FieldInput, FieldLabel } from './Field';

const docs = getComponentDocs('Core/Field');
const email = { label: 'Email', description: 'Used for article updates only.' };

export default {
  title: 'Core/Field',
  id: 'core-field',
  component: Field,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['email', 'text', 'url'], placeholder: 'text', disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-sm'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'email', placeholder: 'you@example.com', disabled: false },
  parameters: {
    docs: {
      source: playgroundSource('FieldInput', {
        imports: "import { Field, FieldDescription, FieldInput, FieldLabel } from '@gaudi/design-system';",
        before: `<Field>\n<FieldLabel>${email.label}</FieldLabel>\n`,
        after: `\n<FieldDescription>${email.description}</FieldDescription>\n</Field>`
      })
    }
  },
  render: (args) => (
    <Field>
      <FieldLabel>{email.label}</FieldLabel>
      <FieldInput {...args} />
      <FieldDescription>{email.description}</FieldDescription>
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(email.label);
    await expect(input).toHaveAttribute('type', args.type);
    await expect(input).toHaveAccessibleDescription(email.description);
    await userEvent.click(canvas.getByText(email.label));
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'reader@example.com');
    await expect(input).toHaveValue('reader@example.com');
  }
};

export const Error = {
  parameters: {
    docs: { description: { story: '`FieldError` marks the input invalid and joins its message to the accessible description, keeping the entered value.' } }
  },
  render: () => (
    <Field>
      <FieldLabel>Article slug</FieldLabel>
      <FieldInput defaultValue='Design Systems' />
      <FieldError>Use lowercase letters and hyphens only.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Article slug');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Use lowercase letters and hyphens only.');
    await expect(input).toHaveValue('Design Systems');
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

import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Field, { FieldDescription, FieldError, FieldLabel } from '../Field';
import Icon from '../Icon';
import Input from './Input';

const docs = getComponentDocs('Core/Input');
const label = 'Email address';
// With no `prefix`, the featured field leads with an icon for its `type`.
const typeIcons = { text: 'Type', email: 'Mail', search: 'Search', url: 'Globe', tel: 'Phone', password: 'Lock' };

export default {
  title: 'Core/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    type: Object.keys(typeIcons),
    placeholder: 'text',
    prefix: 'text',
    suffix: 'text',
    invalid: 'boolean',
    required: 'boolean',
    disabled: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'email', placeholder: 'you@example.com', suffix: '', invalid: true, required: true, disabled: false },
  parameters: {
    docs: {
      description: { story: 'A profile form with text and icon adornments. The email field follows the controls: `type` picks its icon, `required` marks the label, `invalid` shows the error, and `disabled` locks it. The other fields show filled, prefixed, and suffixed inputs.' },
      source: playgroundSource('Input', {
        imports: "import { Field, FieldError, FieldLabel, Icon, Input } from '@gaudi/design-system';",
        attributes: ["prefix={<Icon name='Mail' decorative size='sm' />}"],
        before: `<Field>\n  <FieldLabel>${label}</FieldLabel>\n`,
        after: "\n  {invalid && <FieldError>Enter an address like name@example.com.</FieldError>}\n</Field>"
      })
    }
  },
  render: ({ prefix, suffix, ...args }) => (
    <div className='ds-stack'>
      <Field>
        <FieldLabel>{label}{args.required ? <span aria-hidden='true' className='text-red-600'> *</span> : null}</FieldLabel>
        <Input {...args} prefix={prefix || <Icon name={typeIcons[args.type]} decorative size='sm' />} suffix={suffix || undefined} />
        {args.invalid ? <FieldError>Enter an address like name@example.com.</FieldError> : <FieldDescription>{args.disabled ? 'Locked by your workspace admin.' : 'Receipts and sign-in links go here.'}</FieldDescription>}
      </Field>
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input prefix='@' defaultValue='amira' />
        </Field>
        <Field>
          <FieldLabel>Monthly budget</FieldLabel>
          <Input type='number' prefix='$' suffix='USD' defaultValue={120} />
        </Field>
      </div>
      <Field>
        <FieldLabel>Website</FieldLabel>
        <Input type='url' prefix='https://' placeholder='example.com' />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(label, { exact: false, selector: 'input' });
    await expect(input).toHaveAttribute('type', args.type);
    await expect(input).toHaveAttribute('placeholder', args.placeholder);
    if (args.required) await expect(input).toBeRequired();
    if (args.invalid) {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(canvas.getByText('Enter an address like name@example.com.')).toBeVisible();
    }
    if (args.suffix) await expect(canvas.getByText(args.suffix)).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Username' })).toHaveValue('amira');
    // Adornments are presentational: the value excludes the prefix and suffix.
    await expect(canvas.getByRole('spinbutton', { name: 'Monthly budget' })).toHaveValue(120);
    const website = canvas.getByRole('textbox', { name: 'Website' });
    await userEvent.type(website, 'gaudi.dev');
    await expect(website).toHaveValue('gaudi.dev');
    await expect(canvas.getByText('https://')).toBeVisible();
    await userEvent.clear(website);
    if (args.disabled) return expect(input).toBeDisabled();
    await userEvent.type(input, 'amira@example.com');
    await expect(input).toHaveValue('amira@example.com');
    // Leave the preview on its placeholder so `placeholder` stays visible.
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
  }
};

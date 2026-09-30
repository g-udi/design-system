import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Field, { FieldLabel } from '../Field';
import Input from './Input';

const docs = getComponentDocs('Core/Input');
const label = 'Email address';

export default {
  title: 'Core/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    type: ['text', 'email', 'search', 'url', 'tel', 'password'],
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
  args: { type: 'email', placeholder: 'you@example.com', invalid: false, required: false, disabled: false },
  parameters: {
    docs: {
      source: playgroundSource('Input', {
        imports: "import { Field, FieldLabel, Input } from '@gaudi/design-system';",
        before: `<Field>\n  <FieldLabel>${label}</FieldLabel>\n`,
        after: '\n</Field>'
      })
    }
  },
  render: ({ prefix, suffix, ...args }) => (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input {...args} prefix={prefix || undefined} suffix={suffix || undefined} />
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByLabelText(label);
    await expect(input).toHaveAttribute('type', args.type);
    if (args.invalid) await expect(input).toHaveAttribute('aria-invalid', 'true');
    if (args.disabled) return expect(input).toBeDisabled();
    await userEvent.type(input, 'amira@example.com');
    await expect(input).toHaveValue('amira@example.com');
  }
};

export const Adornments = {
  parameters: { docs: { description: { story: '`prefix` and `suffix` add fixed text or icons inside the field. They are presentational, so the value excludes them.' } } },
  render: () => (
    <div className='ds-stack'>
      <Field>
        <FieldLabel>Website</FieldLabel>
        <Input prefix='https://' name='website' placeholder='example.com' />
      </Field>
      <Field>
        <FieldLabel>Reading goal</FieldLabel>
        <Input type='number' min={1} max={60} defaultValue={20} suffix='minutes' />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const website = canvas.getByRole('textbox', { name: 'Website' });
    await userEvent.type(website, 'gaudi.dev');
    await expect(website).toHaveValue('gaudi.dev');
    await expect(canvas.getByText('https://')).toBeVisible();
    await expect(canvas.getByRole('spinbutton', { name: 'Reading goal' })).toHaveValue(20);
  }
};

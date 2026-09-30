import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Field, { FieldError, FieldLabel } from '../Field';
import Textarea from './Textarea';

const docs = getComponentDocs('Core/Textarea');
const label = 'Article summary';
const summary = 'A practical introduction to knowledge graphs and the questions they can help answer.';
const textbox = (canvas, name = label) => canvas.getByRole('textbox', { name });

export default {
  title: 'Core/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { rows: 'number', invalid: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { placeholder: 'What should the reader take away?', rows: 4, disabled: false, required: false, invalid: false, onChange: fn() },
  argTypes: { placeholder: { control: 'text' }, disabled: { control: 'boolean' }, required: { control: 'boolean' } },
  parameters: {
    docs: {
      source: playgroundSource('Textarea', {
        imports: "import { Field, FieldLabel, Textarea } from '@gaudi/design-system';",
        before: `<Field>\n  <FieldLabel>${label}</FieldLabel>\n`,
        after: '\n</Field>'
      })
    }
  },
  render: (args) => (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Textarea {...args} />
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    if (args.disabled) return;
    const input = textbox(within(canvasElement));
    await expect(input).toHaveAttribute('rows', `${args.rows}`);
    await userEvent.type(input, 'Graphs{Enter}connect ideas');
    await expect(input).toHaveValue('Graphs\nconnect ideas');
    await expect(args.onChange).toHaveBeenCalled();
  }
};

export const Validation = {
  parameters: { docs: { description: { story: 'Inside a `Field`, `FieldError` marks the textarea invalid and becomes its accessible description.' } } },
  render: () => (
    <Field>
      <FieldLabel>Review notes</FieldLabel>
      <Textarea />
      <FieldError>Add a reason before returning this draft.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = textbox(within(canvasElement), 'Review notes');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Add a reason before returning this draft.');
  }
};

export const ReadOnly = {
  parameters: { docs: { description: { story: '`readOnly` keeps the value focusable and selectable but prevents edits.' } } },
  render: () => (
    <Field>
      <FieldLabel>Published summary</FieldLabel>
      <Textarea readOnly defaultValue={summary} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = textbox(within(canvasElement), 'Published summary');
    await userEvent.type(input, ' Edited');
    await expect(input).toHaveValue(summary);
    await expect(input).toHaveFocus();
  }
};

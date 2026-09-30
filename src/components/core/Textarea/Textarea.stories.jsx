import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Avatar from '../Avatar';
import Button from '../Button';
import Field, { FieldDescription, FieldError, FieldLabel } from '../Field';
import Textarea from './Textarea';

const docs = getComponentDocs('Core/Textarea');
const label = 'Article summary';
const textbox = (canvas, name = label) => canvas.getByRole('textbox', { name });
// A review composer: the note to the author follows the controls.
const noteLabel = 'Note to the author';
const draftNote = 'The introduction is strong. Could the second section open with the diagram instead of the table?';
const limit = 280;
const errorText = 'Name the section that needs changes before returning.';

function ReviewComposer({ invalid, onChange, ...args }) {
  const [value, setValue] = useState(draftNote);
  const update = (event) => {
    setValue(event.target.value);
    onChange(event);
  };
  return (
    <div className='grid gap-3 rounded-lg border border-border p-3'>
      <div className='flex items-center gap-3'>
        <Avatar name='Sam Rivera' size='sm' />
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium'>Return “Knowledge graphs in practice”</p>
          <p className='text-xs text-text-muted'>Sam Rivera will be notified by email.</p>
        </div>
      </div>
      <Field>
        <FieldLabel>
          {noteLabel}
          {args.required ? <span className='ms-1 text-danger' aria-hidden='true'>*</span> : <span className='ms-1 font-normal text-text-muted'>(optional)</span>}
        </FieldLabel>
        <Textarea {...args} invalid={invalid} maxLength={limit} value={value} onChange={update} />
        {invalid ? <FieldError>{errorText}</FieldError> : <FieldDescription>Visible to the author and co-editors.</FieldDescription>}
      </Field>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <span className='text-xs text-text-muted tabular-nums'>{value.length} / {limit}</span>
        <div className='flex gap-2'>
          <Button size='sm' variant='ghost' tone='neutral' disabled={args.disabled}>Cancel</Button>
          <Button size='sm' disabled={args.disabled}>Return draft</Button>
        </div>
      </div>
    </div>
  );
}

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
  args: { rows: 4, disabled: false, required: true, invalid: false, onChange: fn() },
  argTypes: { disabled: { control: 'boolean' }, required: { control: 'boolean' } },
  parameters: {
    docs: {
      description: { story: 'A review composer that returns a draft with a note. `rows` sets the height, `required` swaps the optional hint for a marker, `invalid` shows the error, and `disabled` locks the note and its actions. The counter follows the text.' },
      source: playgroundSource('Textarea', {
        imports: "import { Field, FieldDescription, FieldLabel, Textarea } from '@gaudi/design-system';",
        attributes: [`maxLength={${limit}}`, 'value={note}', 'onChange={(event) => setNote(event.target.value)}'],
        before: `<Field>\n  <FieldLabel>${noteLabel}</FieldLabel>\n`,
        after: '\n  <FieldDescription>Visible to the author and co-editors.</FieldDescription>\n</Field>'
      })
    }
  },
  render: (args) => <ReviewComposer {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = textbox(canvas, new RegExp(`^${noteLabel}`));
    await expect(input).toHaveAttribute('rows', `${args.rows}`);
    await expect(input).toHaveValue(draftNote);
    await expect(canvas.getByText(`${draftNote.length} / ${limit}`)).toBeVisible();
    if (args.invalid) await expect(input).toHaveAccessibleDescription(errorText);
    if (args.disabled) {
      await expect(input).toBeDisabled();
      return;
    }
    await userEvent.type(input, '{Enter}Thanks!');
    await expect(input).toHaveValue(`${draftNote}\nThanks!`);
    await expect(args.onChange).toHaveBeenCalled();
    await expect(canvas.getByText(`${draftNote.length + 8} / ${limit}`)).toBeVisible();
  }
};

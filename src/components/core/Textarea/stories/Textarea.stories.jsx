import { PlaygroundDemo, noteLabel, draftNote, limit, errorText, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import Textarea from '../Textarea';

const docs = getComponentDocs('Core/Textarea');
const label = 'Article summary';
const textbox = (canvas, name = label) => canvas.getByRole('textbox', { name });
// A review composer: the note to the author follows the controls.

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Textarea', id: 'core-textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { rows: 'number', invalid: 'boolean', caretMode: ['native', 'smooth'] }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onChange: fn() },
  argTypes: { disabled: { control: 'boolean' }, required: { control: 'boolean' } },
  parameters: {
    docs: {
      description: { story: 'A review composer that returns a draft with a note. `rows` sets the height, `required` swaps the optional hint for a marker, `invalid` shows the error, and `disabled` locks the note and its actions. The counter follows the text.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
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

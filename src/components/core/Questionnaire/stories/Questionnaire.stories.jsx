import { PlaygroundDemo, questions, names, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { Questionnaire } from '../index.js';

const docs = getComponentDocs('Core/Questionnaire');
// An onboarding survey mixing a described single choice with a disabled option, a multiple choice, and an optional question.
// `saved` answers are prefilled so the survey can start on any question and still submit; `pick` is what the test chooses.

const labelOf = (question, value) => question.choices.find((choice) => choice.value === value).label;

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Advanced Inputs/Questionnaire',
  id: 'core-questionnaire',
  component: Questionnaire,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { shortcuts: ['letters', 'numbers'], defaultItem: names }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onItemChange: fn(), onSubmit: fn() },
  parameters: {
    docs: {
      description: { story: 'An onboarding survey: a described single choice with a saved answer and a disabled option, a multiple choice, and an optional question with Skip. `shortcuts` relabels every choice key, and `defaultItem` opens the survey on any question.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const start = names.indexOf(args.defaultItem);
    const keys = args.shortcuts === 'letters' ? ['A', 'B'] : ['1', '2'];
    await expect(canvas.getByRole('progressbar')).toHaveTextContent(`Question ${start + 1} of ${questions.length}`);
    await expect(canvasElement.querySelector('fieldset:not([hidden]) [data-slot="questionnaire-choice-shortcut"]')).toHaveTextContent(keys[0]);
    const expected = {};
    for (const [index, question] of questions.entries()) {
      expected[question.name] = index < start ? question.saved : question.multiple ? [...question.saved, question.pick] : [question.pick];
      if (index < start) continue;
      // Hidden questions are inert, so the answer only resolves once its question is active.
      const answer = await waitFor(() => canvas.getByRole(question.multiple ? 'checkbox' : 'radio', { name: new RegExp(labelOf(question, question.pick)) }));
      await userEvent.click(answer);
      // A checked radio shows only its dot and a checked checkbox only its check.
      const choice = answer.closest('[data-slot="questionnaire-choice"]');
      const shown = (slot) => choice.querySelector(`[data-slot="questionnaire-choice-indicator-${slot}"]`).checkVisibility();
      await expect([shown('dot'), shown('check')]).toEqual(question.multiple ? [false, true] : [true, false]);
      if (index < questions.length - 1) {
        await userEvent.click(canvas.getByRole('button', { name: /^Next/ }));
        await expect(args.onItemChange).toHaveBeenLastCalledWith(names[index + 1]);
      }
    }
    await userEvent.click(canvas.getByRole('button', { name: /^Submit/ }));
    await expect(args.onSubmit).toHaveBeenCalledWith(expected);
  }
};

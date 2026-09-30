import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle
} from './index.js';

const docs = getComponentDocs('Core/Questionnaire');
// An onboarding survey mixing a described single choice with a disabled option, a multiple choice, and an optional question.
// `saved` answers are prefilled so the survey can start on any question and still submit; `pick` is what the test chooses.
const questions = [
  {
    name: 'goal',
    title: 'What brings you to Gaudi?',
    description: 'We tailor your starter templates to this.',
    required: true,
    saved: ['system'],
    pick: 'product',
    choices: [
      { value: 'system', label: 'Build a design system', description: 'Tokens, components and docs for a team.' },
      { value: 'product', label: 'Ship a product faster', description: 'Drop-in blocks for an existing app.' },
      { value: 'migrate', label: 'Migrate from Gaudi 1', description: 'Coming soon.', disabled: true }
    ]
  },
  {
    name: 'channels',
    title: 'Where do you publish?',
    description: 'Choose every channel you use.',
    required: true,
    multiple: true,
    saved: ['blog'],
    pick: 'newsletter',
    choices: [
      { value: 'blog', label: 'Blog' },
      { value: 'newsletter', label: 'Newsletter' },
      { value: 'docs', label: 'Documentation site' }
    ]
  },
  {
    name: 'cadence',
    title: 'How often do you publish?',
    description: 'Optional. Skip it if it varies.',
    saved: [],
    pick: 'monthly',
    choices: [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'occasionally', label: 'Occasionally' }
    ]
  }
];
const names = questions.map(({ name }) => name);
const items = questions.map(({ name, required = false, choices }) => ({ name, required, choices: choices.map(({ value, disabled = false }) => ({ value, disabled })) }));
const labelOf = (question, value) => question.choices.find((choice) => choice.value === value).label;
const sourceQuestions = questions.map(({ name, title, required = false, multiple = false, choices }) => ({ name, title, required, multiple, choices: choices.map(({ value, label }) => ({ value, label })) }));

export default {
  title: 'Core/Inputs/Questionnaire',
  id: 'core-questionnaire',
  component: Questionnaire,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { shortcuts: ['letters', 'numbers'], defaultItem: names }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { shortcuts: 'letters', defaultItem: 'goal', onItemChange: fn(), onSubmit: fn() },
  parameters: {
    docs: {
      description: { story: 'An onboarding survey: a described single choice with a saved answer and a disabled option, a multiple choice, and an optional question with Skip. `shortcuts` relabels every choice key, and `defaultItem` opens the survey on any question.' },
      source: playgroundSource('Questionnaire', {
        imports: `import {\n  Questionnaire, QuestionnaireActions, QuestionnaireChoice, QuestionnaireChoices, QuestionnaireError, QuestionnaireItem,\n  QuestionnaireNext, QuestionnairePrevious, QuestionnaireProgress, QuestionnaireSkip, QuestionnaireSubmit, QuestionnaireTitle\n} from '@gaudi/design-system';\n\nconst questions = ${JSON.stringify(sourceQuestions, null, 2)};\nconst items = questions.map(({ name, required, choices }) => ({ name, required, choices }));`,
        attributes: ['items={items}', 'onSubmit={handleSubmit}'],
        children: "  <QuestionnaireProgress />\n  {questions.map((question) => (\n    <QuestionnaireItem key={question.name} name={question.name} required={question.required} multiple={question.multiple}>\n      <QuestionnaireTitle>{question.title}</QuestionnaireTitle>\n      <QuestionnaireChoices>\n        {question.choices.map((choice) => (\n          <QuestionnaireChoice key={choice.value} value={choice.value}>{choice.label}</QuestionnaireChoice>\n        ))}\n      </QuestionnaireChoices>\n      <QuestionnaireError />\n    </QuestionnaireItem>\n  ))}\n  <QuestionnaireActions>\n    <QuestionnairePrevious />\n    <QuestionnaireSkip />\n    <QuestionnaireNext />\n    <QuestionnaireSubmit />\n  </QuestionnaireActions>"
      })
    }
  },
  render: ({ onSubmit, ...args }) => (
    <Questionnaire
      key={`${args.shortcuts}-${args.defaultItem}`}
      items={items}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSubmit(Object.fromEntries(names.map((name) => [name, data.getAll(name)])));
      }}
      {...args}
    >
      <QuestionnaireProgress />
      {questions.map((question) => (
        <QuestionnaireItem key={question.name} name={question.name} required={question.required} multiple={question.multiple}>
          <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
          <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value} disabled={choice.disabled} defaultChecked={question.saved.includes(choice.value)}>
                {choice.label}
                {choice.description ? <QuestionnaireChoiceDescription>{choice.description}</QuestionnaireChoiceDescription> : null}
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  ),
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

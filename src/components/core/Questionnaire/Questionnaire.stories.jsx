import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle
} from './index.js';

const docs = getComponentDocs('Core/Questionnaire');
const questions = [
  { name: 'role', title: 'What is your role?', choices: ['Writer', 'Editor', 'Designer'] },
  { name: 'cadence', title: 'How often do you publish?', choices: ['Weekly', 'Monthly', 'Occasionally'] }
];
const items = questions.map(({ name, choices }) => ({ name, required: true, choices: choices.map((value) => ({ value })) }));

export default {
  title: 'Core/Questionnaire',
  id: 'core-questionnaire',
  component: Questionnaire,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { shortcuts: ['letters', 'numbers'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { shortcuts: 'letters', onItemChange: fn(), onSubmit: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Questionnaire', {
        imports: `import {\n  Questionnaire, QuestionnaireActions, QuestionnaireChoice, QuestionnaireChoices, QuestionnaireError,\n  QuestionnaireItem, QuestionnaireNext, QuestionnairePrevious, QuestionnaireProgress, QuestionnaireSubmit, QuestionnaireTitle\n} from '@gaudi/design-system';\n\nconst questions = ${JSON.stringify(questions, null, 2)};`,
        children: "  <QuestionnaireProgress />\n  {questions.map((question) => (\n    <QuestionnaireItem key={question.name} name={question.name} required>\n      <QuestionnaireTitle>{question.title}</QuestionnaireTitle>\n      <QuestionnaireChoices>\n        {question.choices.map((choice) => (\n          <QuestionnaireChoice key={choice} value={choice}>{choice}</QuestionnaireChoice>\n        ))}\n      </QuestionnaireChoices>\n      <QuestionnaireError />\n    </QuestionnaireItem>\n  ))}\n  <QuestionnaireActions>\n    <QuestionnairePrevious />\n    <QuestionnaireNext />\n    <QuestionnaireSubmit />\n  </QuestionnaireActions>"
      })
    }
  },
  render: ({ onSubmit, ...args }) => (
    <Questionnaire
      key={args.shortcuts}
      items={items}
      className='gap-4'
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
      {...args}
    >
      <QuestionnaireProgress />
      {questions.map((question) => (
        <QuestionnaireItem key={question.name} name={question.name} required>
          <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice key={choice} value={choice}>{choice}</QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: /Editor/ }));
    await userEvent.click(canvas.getByRole('button', { name: /^Next/ }));
    await expect(args.onItemChange).toHaveBeenLastCalledWith('cadence');
    await waitFor(() => expect(canvas.getByText('Monthly')).toBeVisible());
    await userEvent.click(canvas.getByRole('radio', { name: /Monthly/ }));
    await userEvent.click(canvas.getByRole('button', { name: /^Submit/ }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ role: 'Editor', cadence: 'Monthly' });
  }
};

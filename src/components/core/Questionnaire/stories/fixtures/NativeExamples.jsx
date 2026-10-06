import { Questionnaire, QuestionnaireProgress, QuestionnaireItem, QuestionnaireTitle, QuestionnaireDescription, QuestionnaireChoices, QuestionnaireChoice, QuestionnaireChoiceDescription, QuestionnaireError, QuestionnaireActions, QuestionnairePrevious, QuestionnaireSkip, QuestionnaireNext, QuestionnaireSubmit } from '@gaudi/design-system/core/Questionnaire';

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

export const exampleDefaults = { shortcuts: 'letters', defaultItem: 'goal' };

export function PlaygroundDemo(props) {
  const { onSubmit, ...args } = { ...exampleDefaults, ...props };
  return <Questionnaire
      key={`${args.shortcuts}-${args.defaultItem}`}
      items={items}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSubmit?.(Object.fromEntries(names.map((name) => [name, data.getAll(name)])));
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
    </Questionnaire>;
}

export { questions, names };

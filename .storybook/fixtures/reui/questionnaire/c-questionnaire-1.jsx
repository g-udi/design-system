// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
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
  QuestionnaireSubmit,
  QuestionnaireTitle
} from '../../../../src/components/core/Questionnaire/parts/questionnaire.jsx';
const QUESTIONS = [
  {
    name: 'usage',
    title: 'What will you use the workspace for?',
    description: 'This picks the default views. Nothing here is permanent.',
    choices: [
      {
        value: 'product',
        label: 'Shipping product work',
        hint: 'Roadmap, sprint board and release notes'
      },
      {
        value: 'clients',
        label: 'Running client projects',
        hint: 'Separate spaces, budgets and approvals'
      },
      {
        value: 'research',
        label: 'Tracking research',
        hint: 'Interview notes, findings and shared tags'
      }
    ]
  },
  {
    name: 'size',
    title: 'How many people will join you?',
    description: 'Seats stay flexible. This only sets a starting layout.',
    choices: [
      { value: 'solo', label: 'Just me', hint: 'One private space' },
      {
        value: 'small',
        label: '2 to 10',
        hint: 'A shared space with light roles'
      },
      {
        value: 'mid',
        label: '11 to 50',
        hint: 'Teams, groups and per-team defaults'
      }
    ]
  },
  {
    name: 'first',
    title: 'What should we set up first?',
    description: 'The rest can be added from the sidebar at any point.',
    choices: [
      {
        value: 'board',
        label: 'A project board',
        hint: 'Intake, in progress and done'
      },
      {
        value: 'report',
        label: 'A weekly report',
        hint: 'Sent every Monday to whoever you pick'
      },
      {
        value: 'import',
        label: 'An import from your current tool',
        hint: 'Projects, people and comments come across'
      }
    ]
  }
];
const ITEMS = QUESTIONS.map((question) => ({
  choices: question.choices.map((choice) => ({ value: choice.value })),
  name: question.name,
  required: true
}));
export function Pattern() {
  const titleId = useId();
  const [summary, setSummary] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const answers = {};
    for (const question of QUESTIONS) {
      const value = formData.get(question.name);
      answers[question.name] =
        question.choices.find((choice) => choice.value === value)?.label ??
        'Not answered';
    }
    setSummary(answers);
  }
  if (summary) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Your workspace is ready</CardTitle>
          <CardDescription>
            Built from the three answers below. Every one of them can be changed
            in settings later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-3'>
            {QUESTIONS.map((question) => (
              <div key={question.name} className='grid min-w-0 gap-0.5'>
                <dt className='text-ui-muted-foreground text-sm'>
                  {question.title}
                </dt>
                <dd className='text-sm font-medium'>
                  {summary[question.name]}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={() => setSummary(null)}>
            Start over
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    // Passing items lets the root size the flow before a single fieldset has
    // registered, so the header reads "Question 1 of 3" on the first paint.
    //
    // The root owns the keyboard from here: Cmd or Ctrl with Enter advances,
    // the arrow keys walk answers and questions, and the letter shortcuts
    // stand down while focus is inside a text field.
    <Questionnaire
      className='mx-auto w-full max-w-md'
      defaultItem='usage'
      items={ITEMS}
      shortcuts='letters'
      onSubmit={handleSubmit}
    >
      <Card>
        {QUESTIONS.map((question) => (
          // CardHeader sits between each fieldset and its legend, which stops
          // the legend naming the group. Pairing the title id with
          // aria-labelledby on the item puts that name back.
          //
          // Nothing below pairs a description or an error by hand: the
          // primitive puts the description id into aria-describedby, and adds
          // the error id, plus role="alert", once the item goes invalid.
          <QuestionnaireItem
            key={question.name}
            aria-labelledby={`${titleId}-${question.name}`}
            name={question.name}
            required
          >
            <CardHeader>
              <QuestionnaireTitle
                id={`${titleId}-${question.name}`}
                render={<CardTitle />}
              >
                {question.title}
              </QuestionnaireTitle>
              <QuestionnaireDescription render={<CardDescription />}>
                {question.description}
              </QuestionnaireDescription>
              <CardAction>
                <QuestionnaireProgress />
              </CardAction>
            </CardHeader>
            <CardContent>
              <QuestionnaireChoices>
                {question.choices.map((choice) => (
                  <QuestionnaireChoice key={choice.value} value={choice.value}>
                    {choice.label}
                    <QuestionnaireChoiceDescription>
                      {choice.hint}
                    </QuestionnaireChoiceDescription>
                  </QuestionnaireChoice>
                ))}
              </QuestionnaireChoices>
              <QuestionnaireError />
            </CardContent>
          </QuestionnaireItem>
        ))}

        <CardFooter>
          <QuestionnaireActions className='w-full'>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Finish setup</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  );
}

'use client';
import { useId, useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
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
} from '@gaudi/design-system/core/Questionnaire';
const QUESTIONS = [
  {
    name: 'usage',
    step: 'Use',
    title: 'What will you publish first?',
    description: 'We use this to pick starter templates. You can change it later.',
    choices: [
      {
        value: 'product',
        label: 'A personal blog',
        hint: 'Essays, notes and an about page'
      },
      {
        value: 'clients',
        label: 'A team publication',
        hint: 'Sections, editors and a review queue'
      },
      {
        value: 'research',
        label: 'A research journal',
        hint: 'Citations, footnotes and a reading list'
      }
    ]
  },
  {
    name: 'size',
    step: 'Team',
    title: 'How many people will write with you?',
    description: 'You can invite more writers whenever you like.',
    choices: [
      { value: 'solo', label: 'Just me', hint: 'Only your name on the byline' },
      {
        value: 'small',
        label: '2 to 10',
        hint: 'Authors plus one editor'
      },
      {
        value: 'mid',
        label: '11 to 50',
        hint: 'Desks, editors and shared style rules'
      }
    ]
  },
  {
    name: 'first',
    step: 'First view',
    title: 'Where should we start?',
    description: 'Everything else stays available in the sidebar.',
    choices: [
      {
        value: 'board',
        label: 'An editorial calendar',
        hint: 'Ideas, drafts and published posts'
      },
      {
        value: 'report',
        label: 'A weekly newsletter',
        hint: 'Your latest posts, sent every Monday'
      },
      {
        value: 'import',
        label: 'An import from your old blog',
        hint: 'Posts, images and comments come with you'
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
          <CardTitle>Your publication is ready</CardTitle>
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
      {/*
       * A segmented bar built from the progress render state. It sits outside
       * every question, because only the active fieldset has a layout box.
       */}
      <QuestionnaireProgress
        className='w-full'
        render={(props, state) => {
          const label = `Step ${state.current} of ${state.total} - ${QUESTIONS[state.current - 1]?.step}`;
          return (
            <div {...props} aria-valuetext={label} className='grid gap-1.5 text-xs text-ui-muted-foreground'>
              {/* Hidden: the wrapper already announces the position as a progressbar. */}
              <div aria-hidden='true' className='flex gap-1.5'>
                {Array.from({ length: state.total }, (_, index) => (
                  <span key={index} className={cn('h-1.5 flex-1 rounded-full', index < state.current ? 'bg-ui-primary' : 'bg-ui-muted')} />
                ))}
              </div>
              <span>{label}</span>
            </div>
          );
        }}
      />
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

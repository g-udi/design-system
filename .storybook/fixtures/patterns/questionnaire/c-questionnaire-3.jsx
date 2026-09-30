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
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle
} from '../../../../src/components/core/Questionnaire/parts/questionnaire.jsx';
const SOURCES = [
  { value: 'colleague', label: 'A colleague mentioned it' },
  { value: 'talk', label: 'A conference talk' },
  { value: 'search', label: 'Search' },
  { value: 'newsletter', label: 'A newsletter' }
];
const REPLACING = [
  { value: 'spreadsheet', label: 'A spreadsheet and a group chat' },
  { value: 'legacy', label: 'A tool we have outgrown' },
  { value: 'nothing', label: 'Nothing, this is new for us' }
];
const TIMELINES = [
  { value: 'month', label: 'Inside a month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'exploring', label: 'Still exploring' }
];
const ITEMS = [
  { name: 'source', required: true },
  { name: 'replacing', required: true },
  { name: 'timeline', required: true }
];
function answerLabel(options, value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return 'Not answered';
  }
  return options.find((option) => option.value === value)?.label ?? value;
}
export function Pattern() {
  const titleId = useId();
  const otherId = useId();
  const [answers, setAnswers] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setAnswers({
      source: answerLabel(SOURCES, formData.get('source')),
      replacing: answerLabel(REPLACING, formData.get('replacing')),
      timeline: answerLabel(TIMELINES, formData.get('timeline'))
    });
  }
  if (answers) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Thanks, that helps</CardTitle>
          <CardDescription>
            Your answers are attached to the account, so nobody has to ask again
            on the onboarding call.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-3'>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>
                Heard about us
              </dt>
              <dd className='text-sm font-medium'>{answers.source}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Replacing</dt>
              <dd className='text-sm font-medium'>{answers.replacing}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Live by</dt>
              <dd className='text-sm font-medium'>{answers.timeline}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={() => setAnswers(null)}>
            Answer again
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    // shortcuts stays off here on purpose: single-key answer shortcuts and a
    // text field inside the same question would compete for every keystroke.
    //
    // The root ships noValidate on by default, so the browser never takes the
    // question over. What gates Next is the primitive's own rule, which counts
    // an item satisfied only once it is answered and not flagged invalid.
    <Questionnaire
      className='mx-auto w-full max-w-md'
      defaultItem='source'
      items={ITEMS}
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby={`${titleId}-source`}
          name='source'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-source`} render={<CardTitle />}>
              How did you first hear about us?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Pick the closest match, or write in what actually happened.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {SOURCES.map((source) => (
                <QuestionnaireChoice key={source.value} value={source.value}>
                  {source.label}
                </QuestionnaireChoice>
              ))}
              <div className='grid gap-1.5'>
                <Label htmlFor={otherId}>Somewhere else</Label>
                <QuestionnaireInput id={otherId} placeholder='Tell us where' />
              </div>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-replacing`}
          name='replacing'
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id={`${titleId}-replacing`}
              render={<CardTitle />}
            >
              What are you replacing?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              It changes which import we offer you first.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {REPLACING.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {option.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-timeline`}
          name='timeline'
          required
        >
          <CardHeader>
            <QuestionnaireTitle
              id={`${titleId}-timeline`}
              render={<CardTitle />}
            >
              When do you want to be live?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              An honest answer is more useful than an ambitious one.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {TIMELINES.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {option.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions className='w-full'>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Send answers</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  );
}

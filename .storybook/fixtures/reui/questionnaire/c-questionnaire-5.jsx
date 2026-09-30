// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
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
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle
} from '../../../../src/components/core/Questionnaire/parts/questionnaire.jsx';
const CURRENT = [
  { value: 'sheets', label: 'Spreadsheets on a shared drive' },
  { value: 'legacy', label: 'An in-house tool' },
  { value: 'vendor', label: 'Another vendor' }
];
const WATCH = [
  { value: 'fields', label: 'Custom fields we cannot lose' },
  { value: 'exports', label: 'Historical exports' },
  { value: 'sso', label: 'Single sign-on' }
];
const WINDOWS = [
  { value: 'weekend', label: 'A weekend' },
  { value: 'evening', label: 'A weekday evening' },
  { value: 'anytime', label: 'Any time, we can take downtime' }
];
const ITEMS = [
  { name: 'from', required: true },
  { name: 'watch' },
  { name: 'window', required: true }
];
const WATCH_BADGE = {
  answered: { label: 'Optional - answered', variant: 'primary-light' },
  skipped: { label: 'Optional - skipped', variant: 'outline' },
  unanswered: { label: 'Optional - not answered', variant: 'secondary' }
};
function answerLabel(options, value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return 'Not answered';
  }
  return options.find((option) => option.value === value)?.label ?? value;
}
export function Pattern() {
  const titleId = useId();
  const [watchStatus, setWatchStatus] = useState('unanswered');
  const [summary, setSummary] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSummary({
      from: answerLabel(CURRENT, formData.get('from')),
      watch:
        watchStatus === 'skipped'
          ? 'Skipped'
          : answerLabel(WATCH, formData.get('watch')),
      window: answerLabel(WINDOWS, formData.get('window'))
    });
  }
  function startOver() {
    setSummary(null);
    setWatchStatus('unanswered');
  }
  if (summary) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Migration booked</CardTitle>
          <CardDescription>
            An engineer will confirm the window by email within one working day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-3'>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Moving off</dt>
              <dd className='text-sm font-medium'>{summary.from}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>
                Watch out for
              </dt>
              <dd className='text-sm font-medium'>{summary.watch}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Window</dt>
              <dd className='text-sm font-medium'>{summary.window}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={startOver}>
            Start over
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    // The header row below lives outside the card on purpose. Only the active
    // fieldset has a layout box, so anything inside the card moves with the
    // question, while the progress and the badge should stay put across all
    // three.
    <Questionnaire
      className='mx-auto w-full max-w-md'
      defaultItem='from'
      items={ITEMS}
      onSubmit={handleSubmit}
    >
      <div className='flex items-center justify-between gap-2'>
        <QuestionnaireProgress />
        <Badge variant={WATCH_BADGE[watchStatus].variant}>
          {WATCH_BADGE[watchStatus].label}
        </Badge>
      </div>

      <Card>
        <QuestionnaireItem
          aria-labelledby={`${titleId}-from`}
          name='from'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-from`} render={<CardTitle />}>
              What are you moving off?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              We have an importer for each of these.
            </QuestionnaireDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {CURRENT.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {option.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-watch`}
          name='watch'
          onStatusChange={setWatchStatus}
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-watch`} render={<CardTitle />}>
              Anything we should watch out for?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Skip this if nothing comes to mind. It changes the plan, not the
              price.
            </QuestionnaireDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {WATCH.map((option) => (
                <QuestionnaireChoice key={option.value} value={option.value}>
                  {option.label}
                </QuestionnaireChoice>
              ))}
              <QuestionnaireInput
                aria-label='Something else to watch out for'
                placeholder='Something else'
              />
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-window`}
          name='window'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-window`} render={<CardTitle />}>
              When is your migration window?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Expect roughly two hours of read-only access.
            </QuestionnaireDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {WINDOWS.map((option) => (
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
            <QuestionnaireSkip>Skip for now</QuestionnaireSkip>
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Book the migration</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  );
}

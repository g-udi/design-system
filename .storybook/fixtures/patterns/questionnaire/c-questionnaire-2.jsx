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
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
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

// One flow, three answer types: several checkboxes, a single choice with a
// written answer beside it, and an optional question that can be skipped.
const WORKFLOWS = [
  { value: 'digest', label: 'Daily digest', hint: 'One summary of yesterday, sent at 08:00' },
  { value: 'releases', label: 'Release notes', hint: 'Posted whenever a version ships' },
  { value: 'incidents', label: 'Incident alerts', hint: 'Raised the moment a service degrades' },
  { value: 'rollup', label: 'Weekly roll-up', hint: 'Team activity, every Friday' }
];
const SOURCES = [
  { value: 'colleague', label: 'A colleague mentioned it' },
  { value: 'talk', label: 'A conference talk' },
  { value: 'search', label: 'Search' }
];
const WATCH = [
  { value: 'fields', label: 'Custom fields we cannot lose' },
  { value: 'exports', label: 'Historical exports' },
  { value: 'sso', label: 'Single sign-on' }
];
const ITEMS = [
  { name: 'workflows', required: true },
  { name: 'source', required: true },
  { name: 'watch' }
];
const WATCH_BADGE = {
  answered: { label: 'Optional - answered', variant: 'primary-light' },
  skipped: { label: 'Optional - skipped', variant: 'outline' }
};
function answerLabel(options, value) {
  if (typeof value !== 'string' || value.trim() === '') return 'Not answered';
  // A written answer is not one of the options, so it is shown as typed.
  return options.find((option) => option.value === value)?.label ?? value;
}

export function Pattern() {
  const otherId = useId();
  const [selected, setSelected] = useState([]);
  const [watchStatus, setWatchStatus] = useState('unanswered');
  const [result, setResult] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = formData.getAll('workflows');
    setResult({
      workflows: WORKFLOWS.filter((workflow) => values.includes(workflow.value)).map((workflow) => workflow.label),
      source: answerLabel(SOURCES, formData.get('source')),
      watch: watchStatus === 'skipped' ? 'Skipped' : answerLabel(WATCH, formData.get('watch'))
    });
  }
  function startOver() {
    setResult(null);
    setSelected([]);
    setWatchStatus('unanswered');
  }
  if (result) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Notifications switched on</CardTitle>
          <CardDescription>
            {result.workflows.length} of {WORKFLOWS.length} workflows start sending tomorrow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3'>
            <div className='flex flex-wrap gap-1.5'>
              {result.workflows.map((workflow) => (
                <Badge key={workflow} variant='secondary'>{workflow}</Badge>
              ))}
            </div>
            <dl className='grid gap-2'>
              <div className='grid min-w-0 gap-0.5'>
                <dt className='text-sm text-ui-muted-foreground'>Heard about us</dt>
                <dd className='text-sm font-medium'>{result.source}</dd>
              </div>
              <div className='grid min-w-0 gap-0.5'>
                <dt className='text-sm text-ui-muted-foreground'>Watch out for</dt>
                <dd className='text-sm font-medium'>{result.watch}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={startOver}>Change answers</Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    // No Card around the flow: the root already lays its children out in a
    // column with a gap. The progress line carries role="progressbar" and
    // announces each step, so the badges beside it need no live region.
    <Questionnaire className='mx-auto w-full max-w-md' defaultItem='workflows' items={ITEMS} onSubmit={handleSubmit}>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <QuestionnaireProgress />
        <span className='flex gap-1.5'>
          <Badge variant='primary-light'>{selected.length} of {WORKFLOWS.length} selected</Badge>
          {WATCH_BADGE[watchStatus] ? (
            <Badge variant={WATCH_BADGE[watchStatus].variant}>{WATCH_BADGE[watchStatus].label}</Badge>
          ) : null}
        </span>
      </div>

      {/* multiple on the item is the entire switch for checkboxes. */}
      <QuestionnaireItem name='workflows' multiple required>
        <QuestionnaireTitle>Which workflows should we switch on?</QuestionnaireTitle>
        <QuestionnaireChoices>
          {WORKFLOWS.map((workflow) => (
            <QuestionnaireChoice
              key={workflow.value}
              value={workflow.value}
              onChange={(event) =>
                setSelected((current) =>
                  event.target.checked ? [...current, workflow.value] : current.filter((value) => value !== workflow.value)
                )
              }
            >
              {workflow.label}
              <QuestionnaireChoiceDescription>{workflow.hint}</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      {/* Typing into the input answers the question instead of picking a choice. */}
      <QuestionnaireItem name='source' required>
        <QuestionnaireTitle>How did you first hear about us?</QuestionnaireTitle>
        <QuestionnaireChoices>
          {SOURCES.map((source) => (
            <QuestionnaireChoice key={source.value} value={source.value}>{source.label}</QuestionnaireChoice>
          ))}
          <div className='grid gap-1.5'>
            <Label htmlFor={otherId}>Somewhere else</Label>
            <QuestionnaireInput id={otherId} placeholder='Tell us where' />
          </div>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      {/* Not required, so Skip appears and onStatusChange reports the status. */}
      <QuestionnaireItem name='watch' onStatusChange={setWatchStatus}>
        <QuestionnaireTitle>Anything we should watch out for?</QuestionnaireTitle>
        <QuestionnaireChoices>
          {WATCH.map((option) => (
            <QuestionnaireChoice key={option.value} value={option.value}>{option.label}</QuestionnaireChoice>
          ))}
          <QuestionnaireInput aria-label='Something else to watch out for' placeholder='Something else' />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip>Skip for now</QuestionnaireSkip>
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Turn these on</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}

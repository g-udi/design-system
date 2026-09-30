'use client';
import { useState } from 'react';
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
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle
} from '../../../../src/components/core/Questionnaire/parts/questionnaire.jsx';
const WORKFLOWS = [
  {
    value: 'digest',
    label: 'Daily digest',
    hint: 'One summary of yesterday, sent at 08:00'
  },
  {
    value: 'releases',
    label: 'Release notes',
    hint: 'Posted to the channel whenever a version ships'
  },
  {
    value: 'incidents',
    label: 'Incident alerts',
    hint: 'Raised the moment a service starts degrading'
  },
  {
    value: 'rollup',
    label: 'Weekly roll-up',
    hint: 'Team activity, every Friday afternoon'
  },
  {
    value: 'billing',
    label: 'Billing reminders',
    hint: 'Three working days before an invoice falls due'
  },
  {
    value: 'access',
    label: 'Access reviews',
    hint: 'A quarterly check on who can see what'
  }
];
const REVIEWERS = [
  { value: 'author', label: 'Whoever wrote the change' },
  { value: 'lead', label: 'A named team lead' },
  { value: 'rota', label: 'The reviewer on rota that week' }
];
const CADENCES = [
  { value: 'daily', label: 'Every weekday morning' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'monthly', label: 'Once a month' }
];
const ITEMS = [
  {
    choices: WORKFLOWS.map((option) => ({ value: option.value })),
    name: 'workflows',
    required: true
  },
  {
    choices: REVIEWERS.map((option) => ({ value: option.value })),
    name: 'reviewer',
    required: true
  },
  {
    choices: CADENCES.map((option) => ({ value: option.value })),
    name: 'cadence',
    required: true
  }
];
function labelOf(options, value) {
  return (
    options.find((option) => option.value === value)?.label ?? 'Not answered'
  );
}
export function Pattern() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = formData.getAll('workflows');
    setResult({
      workflows: WORKFLOWS.filter((workflow) =>
        values.includes(workflow.value)
      ).map((workflow) => workflow.label),
      reviewer: labelOf(REVIEWERS, formData.get('reviewer')),
      cadence: labelOf(CADENCES, formData.get('cadence'))
    });
  }
  function startOver() {
    setResult(null);
    setSelected([]);
  }
  if (result) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Notifications switched on</CardTitle>
          <CardDescription>
            {result.workflows.length} of {WORKFLOWS.length} workflows will start
            sending from tomorrow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3'>
            <div className='flex flex-wrap gap-1.5'>
              {result.workflows.map((workflow) => (
                <Badge key={workflow} variant='secondary'>
                  {workflow}
                </Badge>
              ))}
            </div>
            <p className='text-ui-muted-foreground text-sm'>
              Reviewed by {result.reviewer.toLowerCase()}, delivered{' '}
              {result.cadence.toLowerCase()}.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={startOver}>
            Change answers
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    // No Card on this one: the root already lays its children out in a column
    // with a gap, and a bare flow reads as a different surface to its
    // neighbours.
    //
    // The progress line below carries role="progressbar" and announces itself
    // politely on each step, so the badge beside it needs no live region.
    <Questionnaire
      className='mx-auto w-full max-w-md'
      defaultItem='workflows'
      items={ITEMS}
      shortcuts='letters'
      onSubmit={handleSubmit}
    >
      <div className='flex items-center justify-between gap-2'>
        <QuestionnaireProgress />
        <Badge variant='primary-light'>
          {selected.length} of {WORKFLOWS.length} selected
        </Badge>
      </div>

      <QuestionnaireItem name='workflows' multiple required>
        <QuestionnaireTitle>
          Which workflows should we switch on?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          {WORKFLOWS.map((workflow) => (
            // multiple on the item is the entire switch for checkboxes. The
            // indicator swaps on the choice's own data-type attribute, so this
            // markup is byte for byte what a single-answer question uses.
            <QuestionnaireChoice
              key={workflow.value}
              value={workflow.value}
              onChange={(event) =>
                setSelected((current) =>
                  event.target.checked
                    ? [...current, workflow.value]
                    : current.filter((value) => value !== workflow.value)
                )
              }
            >
              {workflow.label}
              <QuestionnaireChoiceDescription>
                {workflow.hint}
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name='reviewer' required>
        <QuestionnaireTitle>
          Who reviews changes before they ship?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          {REVIEWERS.map((reviewer) => (
            <QuestionnaireChoice key={reviewer.value} value={reviewer.value}>
              {reviewer.label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name='cadence' required>
        <QuestionnaireTitle>
          How often should the digest arrive?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          {CADENCES.map((cadence) => (
            <QuestionnaireChoice key={cadence.value} value={cadence.value}>
              {cadence.label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Turn these on</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}

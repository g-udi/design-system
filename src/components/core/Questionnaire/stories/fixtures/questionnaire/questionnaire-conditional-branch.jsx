'use client';
import { useId, useMemo, useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
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
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const USAGE = [
  { value: 'solo', label: 'Just me' },
  { value: 'team', label: 'A team writing for one publication' },
  { value: 'agency', label: 'An agency writing for several clients' }
];
const OWNERS = [
  {
    value: 'amara',
    name: 'Yewande Achterberg',
    role: 'Operations lead',
    initials: 'YA',
    photo:
      '/avatars/person-23.svg'
  },
  {
    value: 'ines',
    name: 'Paz Oyelaran',
    role: 'Delivery manager',
    initials: 'PO',
    photo:
      '/avatars/person-20.svg'
  },
  {
    value: 'theo',
    name: 'Teodora Lindqvist-Ruiz',
    role: 'Engineering manager',
    initials: 'TL',
    photo:
      '/avatars/person-44.svg'
  },
  {
    value: 'daniel',
    name: 'Ansel Mwangi',
    role: 'Finance partner',
    initials: 'AM',
    photo:
      '/avatars/person-46.svg'
  }
];
const TAIL = [
  {
    name: 'import',
    title: 'What should we bring over first?',
    description: 'Everything else follows once you have checked the first batch.',
    choices: [
      { value: 'projects', label: 'Posts and their drafts' },
      { value: 'people', label: 'Authors and their bios' },
      { value: 'files', label: 'Images and downloads' }
    ]
  },
  {
    name: 'start',
    title: 'When should readers see it?',
    description: 'Nothing is published until you say so.',
    choices: [
      { value: 'now', label: 'Right away' },
      { value: 'week', label: 'At the end of the week' },
      { value: 'later', label: 'After the editors have reviewed it' }
    ]
  }
];
function labelOf(options, value) {
  return (
    options.find((option) => option.value === value)?.label ?? 'Not answered'
  );
}
export function Pattern() {
  const titleId = useId();
  const [usage, setUsage] = useState('');
  const [summary, setSummary] = useState(null);
  const needsOwner = usage === 'team' || usage === 'agency';
  const items = useMemo(
    () => [
      { name: 'usage', required: true },
      { disabled: !needsOwner, name: 'owner', required: true },
      ...TAIL.map((question) => ({ name: question.name, required: true }))
    ],
    [needsOwner]
  );
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const owner = OWNERS.find(
      (person) => person.value === formData.get('owner')
    );
    setSummary({
      usage: labelOf(USAGE, formData.get('usage')),
      owner: owner?.name ?? null,
      first: labelOf(TAIL[0].choices, formData.get('import')),
      start: labelOf(TAIL[1].choices, formData.get('start'))
    });
  }
  if (summary) {
    return (
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Publication created</CardTitle>
          <CardDescription>
            The import runs in the background. You can start using the workspace
            before it finishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-3'>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Used for</dt>
              <dd className='text-sm font-medium'>{summary.usage}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Owner</dt>
              <dd
                className={cn(
                  'text-sm font-medium',
                  summary.owner === null && 'text-ui-muted-foreground'
                )}
              >
                {summary.owner ?? 'Not applicable'}
              </dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Importing</dt>
              <dd className='text-sm font-medium'>{summary.first}</dd>
            </div>
            <div className='grid min-w-0 gap-0.5'>
              <dt className='text-ui-muted-foreground text-sm'>Starting</dt>
              <dd className='text-sm font-medium'>{summary.start}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button size='sm' variant='outline' onClick={() => setSummary(null)}>
            Create another
          </Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    // Progress is repeated in every card header rather than written once above
    // the card. Only the active fieldset has a layout box, so a counter placed
    // inside one question would disappear along with it on the next step.
    <Questionnaire
      className='mx-auto w-full max-w-md'
      items={items}
      onReset={() => setUsage('')}
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem
          aria-labelledby={`${titleId}-usage`}
          name='usage'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-usage`} render={<CardTitle />}>
              How will your team use this?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Shared workspaces add a question about who owns them.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {USAGE.map((option) => (
                <QuestionnaireChoice
                  key={option.value}
                  checked={usage === option.value}
                  value={option.value}
                  onChange={() => setUsage(option.value)}
                >
                  {option.label}
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={`${titleId}-owner`}
          disabled={!needsOwner}
          name='owner'
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={`${titleId}-owner`} render={<CardTitle />}>
              Who should own the workspace?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              The owner manages billing and can invite everyone else.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              {OWNERS.map((person) => (
                <QuestionnaireChoice key={person.value} value={person.value}>
                  <span className='flex min-w-0 items-center gap-2.5'>
                    <Avatar size='sm'>
                      <AvatarImage src={person.photo} alt='' />
                      <AvatarFallback>{person.initials}</AvatarFallback>
                    </Avatar>
                    <span className='truncate'>{person.name}</span>
                  </span>
                  <QuestionnaireChoiceDescription>
                    {person.role}
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        {TAIL.map((question) => (
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
            <QuestionnaireSubmit>Create the publication</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>

      <div className='flex justify-end'>
        <Button type='reset' size='sm' variant='outline'>
          <RegistryIcon
            lucide='RotateCcwIcon'
            data-icon='inline-start'
            aria-hidden='true'
          />
          Start over
        </Button>
      </div>
    </Questionnaire>
  );
}

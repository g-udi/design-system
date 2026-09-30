// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useMemo, useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const USAGE = [
  { value: 'solo', label: 'Just me' },
  { value: 'team', label: 'A team inside one company' },
  { value: 'agency', label: 'Client work across several companies' }
];
const OWNERS = [
  {
    value: 'amara',
    name: 'Amara Boateng',
    role: 'Operations lead',
    initials: 'AB',
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80'
  },
  {
    value: 'ines',
    name: 'Ines Roca',
    role: 'Delivery manager',
    initials: 'IR',
    photo:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80'
  },
  {
    value: 'theo',
    name: 'Theo Lindqvist',
    role: 'Engineering manager',
    initials: 'TL',
    photo:
      'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    value: 'daniel',
    name: 'Daniel Okafor',
    role: 'Finance partner',
    initials: 'DO',
    photo:
      'https://randomuser.me/api/portraits/women/44.jpg'
  }
];
const TAIL = [
  {
    name: 'import',
    title: 'What should we import first?',
    description: 'The rest follows once the first import has been checked.',
    choices: [
      { value: 'projects', label: 'Projects and their tasks' },
      { value: 'people', label: 'People and their roles' },
      { value: 'files', label: 'Files and attachments' }
    ]
  },
  {
    name: 'start',
    title: 'When do you want to start?',
    description: 'Nothing reaches your team until you say so.',
    choices: [
      { value: 'now', label: 'Right away' },
      { value: 'week', label: 'Later this week' },
      { value: 'later', label: 'After the team is briefed' }
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
          <CardTitle>Workspace created</CardTitle>
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
            <QuestionnaireSubmit>Create the workspace</QuestionnaireSubmit>
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

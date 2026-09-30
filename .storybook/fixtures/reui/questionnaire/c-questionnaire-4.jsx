// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
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
} from '../../../../src/components/core/Questionnaire/parts/questionnaire.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const QUESTIONS = [
  {
    name: 'source',
    step: 'Source',
    title: 'Where does the data come from?',
    choices: [
      { value: 'warehouse', label: 'A warehouse table' },
      { value: 'stream', label: 'An event stream' },
      { value: 'uploads', label: 'Files uploaded by hand' }
    ]
  },
  {
    name: 'volume',
    step: 'Volume',
    title: 'How much arrives in a day?',
    choices: [
      { value: 'small', label: 'Under 1M rows' },
      { value: 'medium', label: '1M to 50M rows' },
      { value: 'large', label: 'More than 50M rows' }
    ]
  },
  {
    name: 'alerting',
    step: 'Alerting',
    title: 'Who should be alerted when it stalls?',
    choices: [
      { value: 'oncall', label: 'The on-call rota' },
      { value: 'data', label: 'The data team channel' },
      { value: 'none', label: 'Nobody yet' }
    ]
  },
  {
    name: 'owner',
    step: 'Owner',
    title: 'Who owns the pipeline?',
    choices: [
      { value: 'me', label: 'Me' },
      { value: 'teammate', label: 'A teammate' },
      { value: 'undecided', label: 'Still deciding' }
    ]
  }
];
const ITEMS = QUESTIONS.map((question) => ({
  name: question.name,
  required: true
}));
export function Pattern() {
  const [created, setCreated] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const source = QUESTIONS[0].choices.find(
      (choice) => choice.value === formData.get('source')
    );
    setCreated(source?.label.toLowerCase() ?? 'the chosen source');
  }
  if (created) {
    return (
      // Empty, not a Card, for the ending. The flow itself runs bare, so a
      // panel appearing only at the finish would introduce a frame the visitor
      // had not been looking at for the previous four steps.
      <Empty className='mx-auto w-full max-w-md'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='CircleCheckIcon' aria-hidden='true' />
          </EmptyMedia>
          <EmptyTitle>Pipeline queued</EmptyTitle>
          <EmptyDescription>
            We are provisioning a pipeline from {created}. The first run starts
            as soon as the connection is verified.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size='sm' variant='outline' onClick={() => setCreated(null)}>
            Set up another
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <Questionnaire
      className='mx-auto w-full max-w-md'
      defaultItem='source'
      items={ITEMS}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress
        className='w-full'
        render={(props, state) => {
          const step = QUESTIONS[state.current - 1]?.step;
          const label = `Step ${state.current} of ${state.total} - ${step}`;
          return (
            <div {...props} aria-valuetext={label}>
              <div aria-hidden='true' className='mb-2 flex gap-1.5'>
                {Array.from({ length: state.total }, (_, index) => (
                  // Hidden from assistive tech because the wrapper already
                  // carries role="progressbar" with aria-valuenow, so exposing
                  // the segments would announce the position a second time.
                  //
                  // state.current is 1-based, hence the strict less-than, and
                  // state.total counts the enabled items rather than the
                  // rendered ones, so disabling a question drops a segment.
                  <span
                    key={index}
                    className={cn(
                      'h-1.5 flex-1 rounded-full',
                      index < state.current ? 'bg-ui-primary' : 'bg-ui-muted'
                    )}
                  />
                ))}
              </div>
              <span>{label}</span>
            </div>
          );
        }}
      />

      {QUESTIONS.map((question) => (
        // The title renders as the fieldset's own legend with nothing between
        // the two, so the group is named without any aria-labelledby pairing.
        // A card header in between would break that and need one.
        <QuestionnaireItem key={question.name} name={question.name} required>
          <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                {choice.label}
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Create the pipeline</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}

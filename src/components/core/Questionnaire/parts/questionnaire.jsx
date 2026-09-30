'use client';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';
import { cn } from '../../../../utilities/cn/index.js';
import { buttonVariants } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Questionnaire({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Root
      data-slot='questionnaire'
      className={cn(
        'ds-part-questionnaire flex w-full min-w-0 flex-col',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireProgress({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot='questionnaire-progress'
      className={cn(
        'ds-part-questionnaire-progress min-h-[1lh] w-fit min-w-[14ch] font-medium text-ui-muted-foreground tabular-nums',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireItem({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Item
      data-slot='questionnaire-item'
      className={cn(
        'ds-part-questionnaire-item min-w-0 border-0 p-0 outline-none',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireTitle({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Title
      data-slot='questionnaire-title'
      className={cn(
        'ds-part-questionnaire-title ds-part-font-heading text-pretty',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireDescription({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Description
      data-slot='questionnaire-description'
      className={cn(
        'ds-part-questionnaire-description text-pretty text-ui-muted-foreground',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireChoices({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot='questionnaire-choices'
      className={cn(
        'ds-part-questionnaire-choices group/questionnaire-choices grid min-w-0',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireChoice({ children, className, ...props }) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot='questionnaire-choice'
      className={cn(
        'ds-part-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start transition-colors outline-none select-none',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot='questionnaire-choice-input'
        className='ds-part-questionnaire-choice-input absolute inset-0 z-10 size-full cursor-pointer opacity-0'
      />
      <span
        aria-hidden='true'
        data-slot='questionnaire-choice-indicator'
        className='ds-part-questionnaire-choice-indicator pointer-events-none relative flex shrink-0 items-center justify-center border group-data-[type=radio]/questionnaire-choice:rounded-full'
      >
        <span
          data-slot='questionnaire-choice-indicator-dot'
          className='ds-part-questionnaire-choice-indicator-dot hidden rounded-full group-data-[type=radio]/questionnaire-choice:group-data-checked/questionnaire-choice:block'
        />
        <RegistryIcon
          data-slot='questionnaire-choice-indicator-check'
          className='ds-part-questionnaire-choice-indicator-check hidden group-data-[type=checkbox]/questionnaire-choice:group-data-checked/questionnaire-choice:block'
          lucide='CheckIcon'
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot='questionnaire-choice-label'
        className='ds-part-questionnaire-choice-label ds-part-questionnaire-choice-content flex min-w-0 flex-1 flex-col leading-snug'
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot='questionnaire-choice-shortcut'
        className='ds-part-questionnaire-choice-shortcut ds-part-questionnaire-shortcut pointer-events-none ms-auto hidden shrink-0 group-data-[shortcut]/questionnaire-choice:inline-flex'
      />
    </QuestionnairePrimitive.Choice>
  );
}
function QuestionnaireChoiceDescription({ className, ...props }) {
  return (
    <span
      data-slot='questionnaire-choice-description'
      className={cn('ds-part-questionnaire-choice-description', className)}
      {...props}
    />
  );
}
function QuestionnaireInput({ className, ...props }) {
  return (
    <div
      data-slot='questionnaire-input-wrapper'
      className='ds-part-questionnaire-input-wrapper group/questionnaire-input relative min-w-0'
    >
      <QuestionnairePrimitive.Input
        data-slot='questionnaire-input'
        className={cn(
          'ds-part-questionnaire-input min-h-11 w-full min-w-0 transition-[color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0',
          'selection:bg-ui-primary selection:text-ui-primary-foreground placeholder:text-ui-muted-foreground',
          className
        )}
        {...props}
      />
    </div>
  );
}
function QuestionnaireError({ className, ...props }) {
  return (
    <QuestionnairePrimitive.Error
      data-slot='questionnaire-error'
      className={cn(
        'ds-part-questionnaire-error text-ui-destructive',
        className
      )}
      {...props}
    />
  );
}
function QuestionnaireActions({ className, ...props }) {
  return (
    <div
      data-slot='questionnaire-actions'
      className={cn(
        'ds-part-questionnaire-actions grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center',
        className
      )}
      {...props}
    />
  );
}
function QuestionnairePrevious({
  children,
  className,
  size = 'default',
  variant = 'outline',
  ...props
}) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot='questionnaire-previous'
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'ds-part-questionnaire-previous col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0',
        className
      )}
      {...props}
    >
      {children ?? 'Previous'}
    </QuestionnairePrimitive.Previous>
  );
}
function QuestionnaireSkip({
  children,
  className,
  size = 'default',
  variant = 'outline',
  ...props
}) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot='questionnaire-skip'
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'ds-part-questionnaire-skip col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0',
        className
      )}
      {...props}
    >
      {children ?? 'Skip'}
    </QuestionnairePrimitive.Skip>
  );
}
function QuestionnaireNext({
  children,
  className,
  size = 'default',
  variant = 'default',
  ...props
}) {
  return (
    <QuestionnairePrimitive.Next
      data-slot='questionnaire-next'
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'ds-part-questionnaire-next col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0',
        className
      )}
      {...props}
    >
      {children ?? 'Next'}
    </QuestionnairePrimitive.Next>
  );
}
function QuestionnaireSubmit({
  children,
  className,
  size = 'default',
  variant = 'default',
  ...props
}) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot='questionnaire-submit'
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        'ds-part-questionnaire-submit col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0',
        className
      )}
      {...props}
    >
      {children ?? 'Submit'}
    </QuestionnairePrimitive.Submit>
  );
}
export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
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
};

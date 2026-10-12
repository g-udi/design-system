'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn';
import Stepper from '../../core/Stepper';
import Progress from '../../core/Progress';
import Button from '../../core/Button';
import EmptyState from '../../core/EmptyState';

/**
 * State belongs above the wizard so fields survive step changes. Changing the step IDs restarts the flow.
 * `indicator` shows progress as numbered `steps`, a `progress` bar, compact `dots` or a `vertical` step list beside
 * the form; `aside` (a node, or a function of the active step) renders a live summary next to it. `navigable` lets
 * people jump back to any completed step; `completion` replaces the default finished state.
 */
export default function Wizard(props) {
  const signature = JSON.stringify((props.steps || []).map((step) => step.id));
  return <WizardFlow key={signature} {...props} />;
}

function WizardFlow({
  title,
  description,
  steps = [],
  children,
  validateStep,
  onComplete,
  completeLabel = 'Finish',
  completionTitle = 'All set',
  completionDescription,
  errorMessage = 'We could not save your changes. Please try again.',
  validationMessage = 'Check the fields in this step before continuing.',
  labels = {},
  indicator = 'steps',
  aside,
  navigable = false,
  completion
}) {
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  const panel = useRef(null);
  const focusState = useRef({ active, complete, error });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    const previous = focusState.current;
    if (
      previous.active !== active ||
      previous.complete !== complete ||
      previous.error !== error
    ) {
      const invalidField =
        error && panel.current?.querySelector('[aria-invalid="true"]');
      (invalidField || panel.current)?.focus();
    }
    focusState.current = { active, complete, error };
  }, [active, complete, error]);
  if (!steps.length) return null;
  const advance = async (event) => {
    event.preventDefault();
    if (busy.current || complete) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      for (let index = 0; index <= active; index++) {
        const valid = await validateStep?.(index);
        if (!mounted.current) return;
        if (valid === false) {
          setActive(index);
          setError(validationMessage);
          return;
        }
      }
      if (active < steps.length - 1) setActive(active + 1);
      else {
        await onComplete();
        if (mounted.current) setComplete(true);
      }
    } catch {
      if (mounted.current) setError(errorMessage);
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };
  const step = complete ? steps.length : active;
  const vertical = indicator === 'vertical';
  const asideNode = typeof aside === 'function' ? aside(active, complete) : aside;
  // Going back never needs validation; steps ahead stay behind the Continue guard.
  const goTo = navigable && !complete && !pending ? (index) => {
    setError('');
    setActive(index);
  } : undefined;
  const stepLabel = complete ? 'Complete' : `Step ${active + 1} of ${steps.length}`;
  const progress =
    indicator === 'dots' ? (
      <div data-slot='wizard-dots' className='flex items-center justify-between gap-3'>
        <ol aria-label={stepLabel} className='m-0 flex list-none items-center p-0'>
          {steps.map((item, index) => {
            const dot = (
              <span
                aria-hidden='true'
                className={cn(
                  'block h-1.5 rounded-full transition-all',
                  index === step ? 'bg-accent w-5' : index < step ? 'bg-text w-1.5' : 'bg-text-muted/40 w-1.5'
                )}
              />
            );
            return (
              <li key={item.id} aria-current={index === step ? 'step' : undefined}>
                {goTo && index < active ? (
                  <Button variant='ghost' size='icon-xs' aria-label={`Back to ${item.label}`} onClick={() => goTo(index)}>
                    {dot}
                  </Button>
                ) : (
                  <span className='grid h-6 min-w-6 place-items-center px-1'>
                    {dot}
                    <span className='sr-only'>{item.label}{index < step ? ', completed' : ''}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <span className='text-text-muted text-xs'>{stepLabel}</span>
      </div>
    ) : indicator === 'progress' ? (
      <div data-slot='wizard-progress'>
        <Progress label={stepLabel} valueText={complete ? completionTitle : steps[active].label} value={(step / steps.length) * 100} />
      </div>
    ) : (
      <Stepper steps={steps} activeStep={step} orientation={vertical ? 'vertical' : 'horizontal'} onStepSelect={goTo} />
    );
  return (
    <div className='ds-wizard'>
      <header>
        <h2 className='ds-title'>{title}</h2>
        {description && <p className='ds-description'>{description}</p>}
      </header>
      {!vertical && progress}
      <div
        className={cn(
          'grid min-w-0 gap-6',
          vertical && 'md:grid-cols-[minmax(9rem,13rem)_minmax(0,1fr)]',
          asideNode && 'lg:grid-cols-[minmax(0,1fr)_17rem]',
          vertical && asideNode && 'lg:grid-cols-[minmax(9rem,13rem)_minmax(0,1fr)_17rem]'
        )}
      >
        {vertical && progress}
        <div className='min-w-0'>
          {complete ? (
            <div ref={panel} tabIndex={-1}>
              {completion ?? (
                <EmptyState
                  title={completionTitle}
                  description={completionDescription}
                />
              )}
            </div>
          ) : (
            <form onSubmit={advance} aria-label={title} aria-busy={pending}>
              <div
                ref={panel}
                tabIndex={-1}
                className='ds-wizard-panel'
                role='group'
                aria-label={steps[active].label}
              >
                <fieldset disabled={pending}>
                  {typeof children === 'function' ? children(active) : children}
                </fieldset>
                {error && (
                  <p role='alert' className='ds-error'>
                    {error}
                  </p>
                )}
              </div>
              <footer className='ds-wizard-footer'>
                <Button
                  variant='outline'
                  tone='neutral'
                  disabled={!active || pending}
                  onClick={() => {
                    setError('');
                    setActive(active - 1);
                  }}
                >
                  {labels.back || 'Back'}
                </Button>
                <Button type='submit' disabled={pending}>
                  {pending
                    ? labels.pending || 'Saving…'
                    : active === steps.length - 1
                      ? completeLabel
                      : labels.continue || 'Continue'}
                </Button>
              </footer>
            </form>
          )}
        </div>
        {asideNode ? <aside className='min-w-0'>{asideNode}</aside> : null}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Stepper from '../../core/Stepper';
import Button from '../../core/Button';
import EmptyState from '../../core/EmptyState';

/** State belongs above the wizard so fields survive step changes. Changing the step IDs restarts the flow. */
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
  labels = {}
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
  return (
    <div className='ds-wizard'>
      <header>
        <h2 className='ds-title'>{title}</h2>
        {description && <p className='ds-description'>{description}</p>}
      </header>
      <Stepper steps={steps} activeStep={complete ? steps.length : active} />
      {complete ? (
        <div ref={panel} tabIndex={-1}>
          <EmptyState
            title={completionTitle}
            description={completionDescription}
          />
        </div>
      ) : (
        <form onSubmit={advance} aria-label={title} aria-busy={pending}>
          <div
            ref={panel}
            tabIndex={-1}
            className='ds-wizard-panel'
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
  );
}

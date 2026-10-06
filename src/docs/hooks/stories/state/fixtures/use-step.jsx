import { useRef } from 'react';
import Button from '../../../../../components/core/Button';
import Progress from '../../../../../components/core/Progress';
import { useIsomorphicLayoutEffect } from '../../../../../hooks/state/use-isomorphic-layout-effect.js';
import { usePrevious } from '../../../../../hooks/state/use-previous.js';
import { useStep } from '../../../../../hooks/state/use-step.js';

const steps = [
  [ 'Choose a topic', 'Pick what the newsletter is about.' ],
  [ 'Write the intro', 'Two sentences that say why readers should care.' ],
  [ 'Pick a schedule', 'Weekly on Tuesdays works for most readers.' ],
  [ 'Review', 'Check everything before you publish.' ]
];

function NewsletterWizard() {
  const { step, count, next, previous, canGoNext, canGoPrevious, isLast, reset } = useStep({ count: steps.length });
  const headingRef = useRef(null);
  const previousStep = usePrevious(step);
  // Move focus to the new step's heading after Next or Back (not on first render).
  useIsomorphicLayoutEffect(() => {
    if (previousStep !== undefined) headingRef.current?.focus();
  }, [ step ]);
  const [ title, body ] = steps[step];
  return (
    <div className='grid gap-4'>
      <Progress label='Newsletter setup' value={step + 1} max={count} valueText={`Step ${step + 1} of ${count}`} />
      <section aria-labelledby='wizard-step-title' className='grid gap-1'>
        <p className='text-xs font-medium uppercase text-text-muted'>Step {step + 1} of {count}</p>
        <h3 id='wizard-step-title' ref={headingRef} tabIndex={-1} className='text-base font-semibold outline-none'>{title}</h3>
        <p className='text-sm text-text-muted'>{body}</p>
      </section>
      <div className='flex justify-between gap-2'>
        <Button variant='ghost' tone='neutral' disabled={!canGoPrevious} onClick={previous}>Back</Button>
        {isLast ? <Button onClick={reset}>Publish and start over</Button> : <Button disabled={!canGoNext} onClick={next}>Next</Button>}
      </div>
    </div>
  );
}

export { steps, NewsletterWizard };

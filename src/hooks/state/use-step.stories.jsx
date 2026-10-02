import { useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Progress from '../../components/core/Progress';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { usePrevious } from './use-previous.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useStep } from './use-step.js';

export default {
  title: 'Hooks/State/useStep',
  id: 'hooks-state-usestep',
  tags: ['autodocs'],
  ...hookMeta('useStep')
};

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

export const Wizard = {
  name: 'Wizard with progress',
  parameters: example('Back and Next disable at the ends, the Progress bar states the position in text, and focus moves to each new step heading.', `
import { Button, Progress } from '@gaudi/design-system';
import { useStep } from '@gaudi/design-system/hooks';

const { step, count, next, previous, canGoPrevious, isLast } = useStep({ count: steps.length });

<Progress label='Newsletter setup' value={step + 1} max={count} valueText={\`Step \${step + 1} of \${count}\`} />
<h3 ref={headingRef} tabIndex={-1}>{steps[step].title}</h3>
<Button disabled={!canGoPrevious} onClick={previous}>Back</Button>
{isLast ? <Button onClick={publish}>Publish</Button> : <Button onClick={next}>Next</Button>}`),
  render: () => <NewsletterWizard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Back' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Write the intro' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(canvas.getByRole('heading', { name: 'Choose a topic' })).toBeVisible();
  }
};

import { useState } from 'react';
import Pill from '@gaudi/design-system/core/Pill';
import Button from '@gaudi/design-system/core/Button';
import { useInterval } from '@gaudi/design-system/hooks/state/use-interval';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';

function Preference() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className='grid gap-2'>
      <Readout label='Reduce motion'><Value>{reduced}</Value></Readout>
      <p className='text-sm text-text-muted'>Turn on Reduce motion in your operating system settings and this updates without a reload.</p>
    </div>
  );
}

const quotes = [ 'Calm interfaces respect attention.', 'Motion should explain, not decorate.', 'Every animation needs an off switch.' ];

function RotatingQuote() {
  const reduced = usePrefersReducedMotion();
  const [ paused, setPaused ] = useState(false);
  const [ index, setIndex ] = useState(0);
  useInterval(() => setIndex((current) => (current + 1) % quotes.length), reduced || paused ? null : 4000);
  return (
    <div className='grid gap-3'>
      <blockquote className='text-base'>“{quotes[index]}”</blockquote>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setIndex((index + 1) % quotes.length)}>Next quote</Button>
        {reduced ? <Pill tone='neutral' variant='soft' size='sm'>Autoplay off: reduced motion</Pill> : (
          <Button size='sm' variant='ghost' tone='neutral' aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</Button>
        )}
      </div>
    </div>
  );
}

export { Preference, quotes, RotatingQuote };

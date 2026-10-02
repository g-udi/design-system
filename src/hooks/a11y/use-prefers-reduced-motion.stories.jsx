import { useState } from 'react';
import Pill from '../../components/core/Pill';
import Button from '../../components/core/Button';
import { useInterval } from '../state/use-interval.js';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion.js';

export default {
  title: 'Hooks/A11y/usePrefersReducedMotion',
  id: 'hooks-a11y-useprefersreducedmotion',
  tags: ['autodocs'],
  ...hookMeta('usePrefersReducedMotion')
};

function Preference() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className='grid gap-2'>
      <Readout label='Reduce motion'><Value>{reduced}</Value></Readout>
      <p className='text-sm text-text-muted'>Turn on Reduce motion in your operating system settings and this updates without a reload.</p>
    </div>
  );
}

export const Reading = {
  name: 'Read the preference',
  parameters: example('The value follows the system setting live.', `
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks';

const reduced = usePrefersReducedMotion();`),
  render: () => <Preference />
};

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

export const AutoplayOff = {
  name: 'Turn autoplay off',
  parameters: example('Rotating content stops when motion should be reduced, and always keeps a manual control and a pause button.', `
import { Button } from '@gaudi/design-system';
import { useInterval, usePrefersReducedMotion } from '@gaudi/design-system/hooks';

const reduced = usePrefersReducedMotion();
const [paused, setPaused] = useState(false);
useInterval(next, reduced || paused ? null : 4000);`),
  render: () => <RotatingQuote />
};

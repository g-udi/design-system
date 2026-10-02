import { useState } from 'react';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useThrottleCallback } from './use-throttle-callback.js';

export default {
  title: 'Hooks/State/useThrottleCallback',
  id: 'hooks-state-usethrottlecallback',
  tags: ['autodocs'],
  ...hookMeta('useThrottleCallback')
};

function PointerTracker() {
  const [ events, setEvents ] = useState(0);
  const [ updates, setUpdates ] = useState(0);
  const [ position, setPosition ] = useState(null);
  const update = useThrottleCallback((x, y) => {
    setUpdates((count) => count + 1);
    setPosition({ x, y });
  }, 200);
  return (
    <div className='grid gap-2'>
      <div
        aria-hidden='true'
        className='grid h-32 place-items-center rounded-(--ds-radius-card) border border-dashed border-border text-sm text-text-muted'
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setEvents((count) => count + 1);
          update(Math.round(event.clientX - rect.left), Math.round(event.clientY - rect.top));
        }}
      >
        Move the pointer here
      </div>
      <Readout label='Pointer events'>{events}</Readout>
      <Readout label='Throttled updates'>{updates}{position ? ` · last at ${position.x}, ${position.y}` : ''}</Readout>
    </div>
  );
}

export const PointerMoves = {
  name: 'Throttle pointer moves',
  parameters: example('Dozens of pointer events become at most five updates a second, and the trailing call keeps the final position exact.', `
import { useThrottleCallback } from '@gaudi/design-system/hooks';

const update = useThrottleCallback((x, y) => setPosition({ x, y }), 200);
<div onPointerMove={(event) => update(event.clientX, event.clientY)} />`),
  render: () => <PointerTracker />
};

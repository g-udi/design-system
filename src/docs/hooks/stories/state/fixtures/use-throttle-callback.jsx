import { useState } from 'react';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useThrottleCallback } from '@gaudi/design-system/hooks/state/use-throttle-callback';

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

export { PointerTracker };

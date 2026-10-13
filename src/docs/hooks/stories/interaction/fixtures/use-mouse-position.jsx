import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useMousePosition } from '@gaudi/design-system/hooks/interaction/use-mouse-position';

export function PointerReadout() {
  const [enabled, setEnabled] = useState(true);
  const { ref, elementX, elementY, isInside } = useMousePosition({ enabled });
  return <div className='grid gap-3'>
    <div ref={ref} role='region' aria-label='Pointer tracking area' className='grid min-h-40 place-items-center rounded-(--ds-radius) border border-border bg-surface-muted p-4'>
      <p className='text-center text-sm'>Move your pointer over this area.</p>
    </div>
    <output aria-live='off' aria-label='Pointer sample' className='text-sm text-text-muted'>{elementX === null ? 'No pointer sample yet' : `Local position: ${Math.round(elementX)}, ${Math.round(elementY)} · ${isInside ? 'Inside' : 'Outside'}`}</output>
    <Readout>Tracking is supplementary; every control works with a keyboard.</Readout>
    <div><Button aria-pressed={enabled} onClick={() => setEnabled((value) => !value)}>{enabled ? 'Pause tracking' : 'Resume tracking'}</Button></div>
  </div>;
}

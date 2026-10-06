import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useControllableState } from '../../../../../hooks/state/use-controllable-state.js';

function Quantity({ label, value, defaultValue = 1, onChange, min = 1, max = 9 }) {
  const [ quantity, setQuantity ] = useControllableState({ value, defaultValue, onChange });
  return (
    <div role='group' aria-label={label} className='flex items-center gap-2'>
      <Button size='icon-sm' variant='outline' tone='neutral' aria-label={`Fewer ${label.toLowerCase()}`} disabled={quantity <= min} onClick={() => setQuantity((current) => current - 1)}>−</Button>
      <output aria-live='polite' className='w-6 text-center text-sm tabular-nums'>{quantity}</output>
      <Button size='icon-sm' variant='outline' tone='neutral' aria-label={`More ${label.toLowerCase()}`} disabled={quantity >= max} onClick={() => setQuantity((current) => current + 1)}>+</Button>
    </div>
  );
}

function ControlledSeats() {
  const [ seats, setSeats ] = useState(2);
  const available = 4;
  return (
    <div className='grid gap-2'>
      <Quantity label='Seats' value={seats} max={9} onChange={(next) => next <= available && setSeats(next)} />
      <Readout>Only {available} seats are left, so the host refuses anything above {available}.</Readout>
    </div>
  );
}

export { Quantity, ControlledSeats };

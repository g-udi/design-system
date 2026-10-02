import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useControllableState } from './use-controllable-state.js';

export default {
  title: 'Hooks/State/useControllableState',
  id: 'hooks-state-usecontrollablestate',
  tags: ['autodocs'],
  ...hookMeta('useControllableState')
};

/** A small reusable control built on the hook: works with or without `value`. */
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

export const Uncontrolled = {
  name: 'Uncontrolled',
  parameters: example('Without `value` the component keeps its own state, starting from `defaultValue`.', `
import { Button } from '@gaudi/design-system';
import { useControllableState } from '@gaudi/design-system/hooks';

export function Quantity({ label, value, defaultValue = 1, onChange }) {
  const [quantity, setQuantity] = useControllableState({ value, defaultValue, onChange });
  return (
    <div role='group' aria-label={label}>
      <Button aria-label='Fewer' onClick={() => setQuantity((q) => q - 1)}>−</Button>
      <output aria-live='polite'>{quantity}</output>
      <Button aria-label='More' onClick={() => setQuantity((q) => q + 1)}>+</Button>
    </div>
  );
}

<Quantity label='Tickets' defaultValue={2} />`),
  render: () => <Quantity label='Tickets' defaultValue={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'More tickets' }));
    await expect(canvas.getByText('3')).toBeVisible();
  }
};

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

export const Controlled = {
  name: 'Controlled, with the host refusing changes',
  parameters: example('With `value` the host owns the state. Each change is only an offer through `onChange`; here the host refuses more than four seats.', `
const [seats, setSeats] = useState(2);
<Quantity label='Seats' value={seats} onChange={(next) => next <= available && setSeats(next)} />`),
  render: () => <ControlledSeats />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const more = canvas.getByRole('button', { name: 'More seats' });
    await userEvent.click(more);
    await userEvent.click(more);
    await userEvent.click(more);
    await expect(canvas.getByText('4')).toBeVisible();
  }
};

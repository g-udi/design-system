import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import { example, hookMeta } from '../story-helpers.jsx';
import { useInterval } from './use-interval.js';

export default {
  title: 'Hooks/State/useInterval',
  id: 'hooks-state-useinterval',
  tags: ['autodocs'],
  ...hookMeta('useInterval')
};

const format = (total) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

function FocusTimer() {
  const [ running, setRunning ] = useState(false);
  const [ seconds, setSeconds ] = useState(0);
  useInterval(() => setSeconds((value) => value + 1), running ? 1000 : null);
  return (
    <div className='grid gap-3'>
      <p className='font-mono text-3xl tabular-nums' aria-label={`Writing time ${format(seconds)}`}>{format(seconds)}</p>
      <div className='flex gap-2'>
        <Button aria-pressed={running} onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</Button>
        <Button variant='ghost' tone='neutral' disabled={!seconds} onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}>Reset</Button>
      </div>
    </div>
  );
}

export const Timer = {
  name: 'A pausable timer',
  parameters: example('Passing `null` as the delay pauses the interval; the callback uses an updater so it never reads stale state.', `
import { Button } from '@gaudi/design-system';
import { useInterval } from '@gaudi/design-system/hooks';

const [running, setRunning] = useState(false);
const [seconds, setSeconds] = useState(0);
useInterval(() => setSeconds((s) => s + 1), running ? 1000 : null);

<Button aria-pressed={running} onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</Button>`),
  render: () => <FocusTimer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Start' }));
    await waitFor(() => expect(canvas.getByText('00:01')).toBeVisible(), { timeout: 2500 });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByText('00:00')).toBeVisible();
  }
};

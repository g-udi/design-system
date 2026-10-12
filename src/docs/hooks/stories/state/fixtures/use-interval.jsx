import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import { useInterval } from '../../../../../hooks/state/use-interval.js';

const format = (total) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

function FocusTimer() {
  const [ running, setRunning ] = useState(false);
  const [ seconds, setSeconds ] = useState(0);
  useInterval(() => setSeconds((value) => value + 1), running ? 1000 : null);
  return (
    <div className='grid gap-3'>
      <p role='timer' className='font-mono text-3xl tabular-nums' aria-label='Writing time'>{format(seconds)}</p>
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

export { format, FocusTimer };

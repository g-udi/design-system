import Button from '../../../../../components/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useCountdown } from '../../../../../hooks/state/use-countdown.js';

export function PreviewCountdown() {
  const { count, isRunning, start, stop, reset } = useCountdown({ countStart: 3 });
  return <div className='grid gap-3'>
    <Readout label='Preview countdown'><Value>{count}</Value> seconds</Readout>
    <p role='status' className='text-sm text-text-muted'>{count === 0 ? 'Preview complete' : isRunning ? 'Running' : 'Paused'}</p>
    <div className='flex flex-wrap gap-2'>
      <Button onClick={isRunning ? stop : start} disabled={count === 0}>{isRunning ? 'Pause' : 'Start'}</Button>
      <Button variant='outline' onClick={reset}>Reset</Button>
    </div>
  </div>;
}

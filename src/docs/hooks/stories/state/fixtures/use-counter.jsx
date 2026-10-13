import Button from '@gaudi/design-system/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useCounter } from '@gaudi/design-system/hooks/state/use-counter';

export function DraftCounter() {
  const { count, increment, decrement, reset, setCount } = useCounter(1);
  return <div className='grid gap-3'>
    <Readout label='Drafts' live><Value>{count}</Value></Readout>
    <div className='flex flex-wrap gap-2'>
      <Button onClick={increment}>Add draft</Button>
      <Button variant='outline' onClick={decrement} disabled={count <= 0}>Remove draft</Button>
      <Button variant='outline' onClick={() => { setCount((value) => value + 1); setCount((value) => value + 1); }}>Add two</Button>
      <Button variant='ghost' onClick={reset}>Reset</Button>
    </div>
  </div>;
}

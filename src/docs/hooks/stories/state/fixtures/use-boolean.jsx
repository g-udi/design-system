import Button from '../../../../../components/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useBoolean } from '../../../../../hooks/state/use-boolean.js';

export function TogglePreference() {
  const { value, toggle, setTrue, setFalse } = useBoolean(false);
  return <div className='grid gap-3'>
    <Readout label='Reading mode'><Value>{value ? 'Focused' : 'Standard'}</Value></Readout>
    <div className='flex flex-wrap gap-2'>
      <Button aria-pressed={value} onClick={toggle}>Focus reading</Button>
      <Button variant='outline' onClick={setTrue} disabled={value}>Enable</Button>
      <Button variant='outline' onClick={setFalse} disabled={!value}>Disable</Button>
    </div>
  </div>;
}

import { useEffect, useId } from 'react';
import Button from '../../../../../components/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useLocalStorage } from '../../../../../hooks/data/use-local-storage.js';
import { useReadLocalStorage } from '../../../../../hooks/data/use-read-local-storage.js';

function PreferenceReader({ storageKey }) {
  const value = useReadLocalStorage(storageKey, 'Comfortable');
  return <Readout label='Read-only view' live><Value>{value}</Value></Readout>;
}
export function SharedPreference() {
  const id = useId();
  const key = `gaudi:hook-preview:${id}`;
  const [value, setValue, removeValue] = useLocalStorage(key, 'Comfortable');
  useEffect(() => removeValue, [removeValue]);
  return <div className='grid gap-3'>
    <Readout label='Editor'><Value>{value}</Value></Readout>
    <PreferenceReader storageKey={key} />
    <div className='flex flex-wrap gap-2'>
      <Button onClick={() => setValue('Compact')}>Use compact spacing</Button>
      <Button variant='outline' onClick={removeValue}>Clear preference</Button>
    </div>
  </div>;
}

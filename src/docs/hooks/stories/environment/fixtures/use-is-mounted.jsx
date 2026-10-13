import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useIsMounted } from '@gaudi/design-system/hooks/environment/use-is-mounted';

function PreviewPanel({ register }) {
  const isMounted = useIsMounted();
  useEffect(() => { register(isMounted); }, [isMounted, register]);
  return <p className='text-sm'>The preview panel is mounted.</p>;
}
export function MountCheck() {
  const [visible, setVisible] = useState(true);
  const [result, setResult] = useState('Not checked');
  const getter = useRef(() => false);
  const register = useCallback((value) => { getter.current = value; }, []);
  return <div className='grid gap-3'>
    {visible && <PreviewPanel register={register} />}
    <Readout label='Last check' live><Value>{result}</Value></Readout>
    <div className='flex flex-wrap gap-2'>
      <Button onClick={() => setResult(getter.current() ? 'Mounted' : 'Unmounted')}>Check mount state</Button>
      <Button variant='outline' onClick={() => setVisible((value) => !value)}>{visible ? 'Remove preview' : 'Mount preview'}</Button>
    </div>
  </div>;
}

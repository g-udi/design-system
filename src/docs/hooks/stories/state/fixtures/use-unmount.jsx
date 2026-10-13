import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useUnmount } from '@gaudi/design-system/hooks/state/use-unmount';

function DraftPreview({ onClose }) {
  const [name, setName] = useState('Untitled');
  useUnmount(() => onClose(name));
  return <label className='grid gap-2 text-sm'>Preview title<Input value={name} onChange={(event) => setName(event.target.value)} /></label>;
}
export function CleanupPreview() {
  const [visible, setVisible] = useState(true);
  const [closed, setClosed] = useState('None');
  return <div className='grid gap-3'>
    {visible && <DraftPreview onClose={setClosed} />}
    <Readout label='Last closed preview' live><Value>{closed}</Value></Readout>
    <div><Button onClick={() => setVisible((value) => !value)}>{visible ? 'Close preview' : 'Open preview'}</Button></div>
  </div>;
}

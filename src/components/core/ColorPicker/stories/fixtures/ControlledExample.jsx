import { useState } from 'react';
import { ColorPicker } from '@gaudi/design-system/core/ColorPicker';
import Button from '@gaudi/design-system/core/Button';

export function ControlledExample() {
  const [color, setColor] = useState('#2563eb');
  const [locked, setLocked] = useState(false);
  return (
    <div className='grid gap-4'>
      <ColorPicker
        label='Project color'
        value={color}
        onValueChange={next => { if (!locked) setColor(next); }}
        swatches={['#2563eb', '#16a34a', '#e11d48']}
        description={locked ? 'The host is refusing changes.' : 'The host accepts color changes.'}
      />
      <div className='flex flex-wrap gap-2'>
        <Button variant='outline' aria-pressed={locked} onClick={() => setLocked(!locked)}>Lock host value</Button>
        <Button variant='outline' onClick={() => setColor(color === '#f59e0b' ? '#2563eb' : '#f59e0b')}>
          {color === '#f59e0b' ? 'Set blue externally' : 'Set amber externally'}
        </Button>
      </div>
      <output className='text-sm'>Current color: {color}</output>
    </div>
  );
}

'use client';
import { useInterval } from '@gaudi/design-system/hooks';
import { Item } from '@gaudi/design-system/core/Item';
import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { ChatActivityIndicator } from '@gaudi/design-system/chat/ChatActivityIndicator';

const run = ['thinking', 'tool', 'streaming', 'done'];

/** A reply's life cycle, announced as it changes. */
export function Pattern() {
  const [step, setStep] = useState(0);
  useInterval(() => setStep((value) => value + 1), step < run.length - 1 ? 1100 : null);
  return (
    <div className='ds-touch-controls grid w-full max-w-sm gap-3'>
      <Item size='sm' variant='outline' className='justify-between text-sm'>
        <span className='font-medium'>Gaudi</span>
        <ChatActivityIndicator state={run[step]} variant='compact' labels={{ tool: 'Checking reading stats' }} />
      </Item>
      <Button variant='subtle' size='xs' className='justify-self-start' onClick={() => setStep(0)}>Replay</Button>
    </div>
  );
}

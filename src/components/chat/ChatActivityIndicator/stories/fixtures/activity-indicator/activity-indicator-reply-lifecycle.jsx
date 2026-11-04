'use client';
import { useEffect, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { ChatActivityIndicator } from '@gaudi/design-system/chat/ChatActivityIndicator';

const run = ['thinking', 'tool', 'streaming', 'done'];

/** A reply's life cycle, announced as it changes. */
export function Pattern() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= run.length - 1) return undefined;
    const timer = setTimeout(() => setStep((value) => value + 1), 1100);
    return () => clearTimeout(timer);
  }, [step]);
  return (
    <div className='ds-touch-controls grid w-full max-w-sm gap-3'>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-(--ds-radius-card) border px-3 py-2 text-sm'>
        <span className='font-medium'>Gaudi</span>
        <ChatActivityIndicator state={run[step]} variant='compact' labels={{ tool: 'Checking reading stats' }} />
      </div>
      <Button variant='subtle' size='xs' className='justify-self-start' onClick={() => setStep(0)}>Replay</Button>
    </div>
  );
}

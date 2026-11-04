'use client';
import { useEffect, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { ChatMessageReasoning } from '@gaudi/design-system/chat/ChatReasoning';

export function Pattern() {
  const [phase, setPhase] = useState('thinking');
  useEffect(() => {
    if (phase !== 'thinking') return undefined;
    const timer = setTimeout(() => setPhase('answered'), 1800);
    return () => clearTimeout(timer);
  }, [phase]);
  return (
    <div className='ds-touch-controls grid w-full max-w-xl gap-3 text-sm'>
      <ChatMessageReasoning streaming={phase === 'thinking'} duration={2}>
        Comparing the two headline options against the post&apos;s first paragraph, then checking the length against the 60-character limit for the newsletter subject line.
      </ChatMessageReasoning>
      {phase === 'answered' ? <p>Go with <strong>“Drafts that survive the train”</strong>: it promises the payoff and fits the subject line.</p> : null}
      <div>
        <Button variant='subtle' size='xs' className='justify-self-start' onClick={() => setPhase('thinking')}>Ask again</Button>
      </div>
    </div>
  );
}

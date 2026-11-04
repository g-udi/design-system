'use client';
import { useEffect, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { ChatActivityIndicator } from '@gaudi/design-system/chat/ChatActivityIndicator';
import { ChatMessageReasoning } from '@gaudi/design-system/chat/ChatReasoning';

// A prepared reply: real applications drive these labels from their stream events.
const phases = [
  { state: 'thinking', label: 'Thinking' },
  { state: 'tool', label: 'Reading the draft' },
  { state: 'thinking', label: 'Comparing headlines' },
  { state: 'done', label: 'Ready to reply' }
];

export function Pattern() {
  const [step, setStep] = useState(0);
  const phase = phases[step];
  const done = step === phases.length - 1;
  useEffect(() => {
    if (done) return undefined;
    const timer = setTimeout(() => setStep((value) => value + 1), 2200);
    return () => clearTimeout(timer);
  }, [step, done]);

  return (
    <div className='ds-touch-controls mx-auto grid w-full max-w-xl gap-6 text-sm'>
      <p className='max-w-[85%] justify-self-end rounded-(--ds-radius) bg-surface-muted px-3 py-2'>
        Which headline works better for my post about writing offline?
      </p>
      <div className='grid min-h-32 min-w-0 content-start justify-items-start gap-3'>
        <ChatActivityIndicator variant='compact' state={phase.state} labels={{ [phase.state]: phase.label }} />
        {done ? (
          <div className='grid min-w-0 gap-3'>
            <p>Go with <strong>“Drafts that survive the train”</strong>. It promises a clear payoff and fits the newsletter subject line.</p>
            <ChatMessageReasoning label='How this was checked' defaultOpen={false}>
              Compared both headlines with the opening paragraph and checked the 60-character subject-line limit.
            </ChatMessageReasoning>
          </div>
        ) : null}
      </div>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <span className='text-xs text-text-muted'>Sample response</span>
        <Button variant='subtle' size='sm' onClick={() => setStep(0)}>Replay thinking</Button>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';
import { ChatMessage, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageMarkdown } from '@gaudi/design-system/chat/ChatMessageList';
import Button from '@gaudi/design-system/core/Button';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@gaudi/design-system/core/Item';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { Popover, PopoverContent, PopoverTrigger } from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';

// Prepared, fictional incident records keep the example useful without a backend.
const SOURCES = [
  {
    kind: 'document', site: 'Trace · 14:05–14:10', title: 'Checkout traces',
    excerpt: 'POST /api/checkout/confirm p95 rose from 240ms to 3.1s at 14:05. Slow traces contain repeated calls to the tax service. Database connection wait remained below 5ms.'
  },
  {
    kind: 'document', site: 'Deploy log · 14:05–14:41', title: 'Tax client rollout',
    excerpt: 'Tax client 1.9.0 reached eu-west at 14:05. The team rolled back to 1.8.3 at 14:41. Checkout p95 returned to 260ms by 14:43.'
  },
  {
    kind: 'document', site: 'Postmortem · INC-142', title: 'Incident review',
    excerpt: 'The new tax client retried confirm calls twice with a 400ms backoff. The review recommends a bounded retry budget, idempotency checks, and canary alerts on checkout latency and retry volume.'
  }
];
const ANSWERS = [
  {
    label: 'Overview', question: 'Why did checkout latency spike?',
    text: `# A retry loop in the tax client slowed checkout

The spike began with the **1.9.0 rollout at 14:05**. Slow requests repeatedly called the tax service, while database connection wait stayed below 5ms. The evidence points to the tax client’s retry behavior. [1,2]

| Checkout p95 | Before | During | After rollback |
| --- | --- | --- | --- |
| eu-west | 240ms | 3.1s | 260ms |

Rolling back to **1.8.3 at 14:41** restored latency within two minutes. That recovery supports the diagnosis; it does not prove which retry path caused every slow request. [2]

# What to change next

- **Bound retries.** Set a shared deadline and retry budget so one request cannot multiply downstream work.
- **Protect payment flows.** Confirm idempotency before retrying side effects.
- **Catch it in the canary.** Alert on checkout p95 and tax retry volume before expanding a rollout. [3]`
  },
  {
    label: 'Rollback checklist', question: 'How should we verify the rollback?',
    text: `# Verify recovery before closing the incident

The sample deployment log records a rollback to **1.8.3 at 14:41** and a return to 260ms p95 by 14:43. Use that as a baseline for the checks below. [2]

1. **Confirm the deployed version.** Check every eu-west instance is on 1.8.3.
2. **Watch a sustained window.** Compare checkout latency, error rate, and tax retry volume with the pre-incident baseline.
3. **Inspect fresh traces.** Confirm that repeated tax calls have stopped and database connection wait remains low. [1]
4. **Review payment safety.** Look for duplicate side effects before declaring recovery. Idempotency is a follow-up action in the incident review. [3]

These are proposed verification steps. The prepared records do not include a completed payment-safety audit.`
  },
  {
    label: 'Prevent recurrence', question: 'How can we prevent this happening again?',
    text: `# Put a budget around downstream work

The incident review identifies **two retries with a 400ms backoff** in the new tax client. A per-attempt limit alone is not enough: the full checkout request needs a deadline. [3]

- **Share one deadline.** Pass the remaining time budget to each downstream call.
- **Retry selectively.** Retry transient failures only when the operation is safe to repeat.
- **Test the failure path.** Exercise slow responses, timeouts, and exhausted retries before rollout.
- **Gate the canary.** Compare checkout p95 and tax retry volume with the previous version. The sample spike coincided with the rollout. [1,2]

Start with a bounded retry budget and idempotency checks, then use the canary to validate the change under realistic traffic. [3]`
  }
];

function SourceCard({ source, index }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Item as='button' type='button' variant='outline' size='sm' aria-label={`Read source ${index + 1}: ${source.title}`} className='min-w-0 flex-[1_1_11rem] items-start text-start hover:bg-ui-muted'>
          <ItemContent className='min-w-0 gap-1'>
            <span className='text-text-muted flex items-center gap-1.5 text-xs'>
              <RegistryIcon lucide='FileText' className='size-3.5' />
              Source {index + 1}
            </span>
            <ItemTitle className='line-clamp-none w-full text-sm'>{source.title}</ItemTitle>
            <ItemDescription className='line-clamp-none text-xs'>{source.site}</ItemDescription>
          </ItemContent>
        </Item>
      </PopoverTrigger>
      <PopoverContent aria-label={source.title} className='w-80 space-y-2 text-sm leading-relaxed'>
        <p className='font-medium'>{source.title}</p>
        <p className='text-text-muted text-xs'>{source.site}</p>
        <p>{source.excerpt}</p>
      </PopoverContent>
    </Popover>
  );
}

export function Pattern() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(ANSWERS[0].text.length);
  const [rating, setRating] = useState(null);
  const answer = ANSWERS[active];
  const done = revealed >= answer.text.length;
  useEffect(() => {
    if (done) return;
    if (reducedMotion) {
      setRevealed(answer.text.length);
      return;
    }
    const timer = window.setTimeout(() => setRevealed((count) => Math.min(count + 48, answer.text.length)), revealed === 0 ? 280 : 32);
    return () => window.clearTimeout(timer);
  }, [answer, done, reducedMotion, revealed]);
  const showAnswer = (index) => {
    setActive(index);
    setRevealed(0);
    setRating(null);
  };
  const copyText = `${answer.question}\n\n${answer.text}\n\nSources (sample incident)\n${SOURCES.map((source, index) => `[${index + 1}] ${source.title}: ${source.excerpt}`).join('\n')}`;
  return (
    <section aria-label='Research answer' className='ds-touch-controls mx-auto flex w-full max-w-2xl flex-col gap-6'>
      <header className='space-y-3'>
        <h2 className='text-xl leading-snug font-semibold sm:text-2xl'>{answer.question}</h2>
        <p className='text-text-muted text-xs'>Sample incident · eu-west · 3 source records</p>
      </header>

      <div role='group' aria-label='Source records' className='flex flex-wrap gap-2'>
        {SOURCES.map((source, index) => <SourceCard key={source.title} source={source} index={index} />)}
      </div>

      <ChatMessage>
        <ChatMessageContent className='gap-4'>
          <div className='flex min-h-8 items-center gap-2'>
            <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='sm' decorative />
            <span className='text-sm font-medium'>Gaudi</span>
            <span role='status' className='text-text-muted ms-auto flex items-center gap-2 text-xs'>
              {!done ? <Loader /> : <RegistryIcon lucide='Check' className='size-3.5' />}
              {done ? 'Answer ready' : 'Writing answer…'}
            </span>
          </div>
          <ChatMessageMarkdown sources={SOURCES} streaming={!done} aria-busy={!done} className="[&_h3:not(:first-child)]:mt-3">{answer.text.slice(0, revealed)}</ChatMessageMarkdown>
          <ChatMessageFeedback
            copyText={done ? copyText : ''}
            rating={rating}
            onRatingChange={setRating}
            onRegenerate={() => showAnswer(active)}
            labels={{ copy: 'Copy answer', regenerate: 'Regenerate answer' }}
            className='flex-wrap [&_button]:min-h-9 [&_button]:min-w-9'
          />
        </ChatMessageContent>
      </ChatMessage>

      <div className='border-ui-border flex flex-col gap-3 border-t pt-4'>
        <h3 className='text-sm font-medium'>Explore this incident</h3>
        <div role='group' aria-label='Follow-up questions' className='flex flex-wrap gap-2'>
          {ANSWERS.map((item, index) => (
            <Button key={item.label} variant={active === index ? 'secondary' : 'outline'} size='sm' aria-pressed={active === index} onClick={() => showAnswer(index)} className='h-auto min-h-9 max-w-full whitespace-normal text-start'>
              {item.label}
              {index > 0 ? <RegistryIcon lucide='ArrowUpRight' className='size-3.5' /> : null}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Item, ItemContent, ItemMedia } from '@gaudi/design-system/core/Item';
import { ChatMessage, ChatMessageContent, ChatMessageFooter } from '@gaudi/design-system/chat/ChatMessage';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';

// One assistant row moves from thinking, to typing, to settled; once settled
// its footer offers copy, regenerate and a rating.
const DRAFTS = [
  'The tax service began retrying every confirm call at 14:05, twice at 400ms each, so p95 on POST /api/checkout/confirm went from 240ms to 3.1s. The database was never the bottleneck. Rolling the tax client back to 1.8.3 returned p95 to 260ms within two minutes.',
  'It was a retry loop in the tax client, not the database: two retries at 400ms on every confirm call from 14:05. Connection wait stayed under 5ms throughout, and the 14:41 rollback to 1.8.3 brought p95 back to 260ms.'
];
const PENDING_MS = 900;
const STEP_MS = 24;
const STEP_CHARS = 4;

export function Pattern() {
  const reducedMotion = usePrefersReducedMotion();
  const [draftIndex, setDraftIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [vote, setVote] = useState(null);
  const { copy, isCopied: copied, reset: resetCopy } = useCopyToClipboard({ timeout: 1600 });
  const answer = DRAFTS[draftIndex];
  useEffect(() => {
    if (revealed >= answer.length) return;
    if (reducedMotion) {
      setRevealed(answer.length);
      return;
    }
    const id = window.setTimeout(
      () => setRevealed((count) => Math.min(count + STEP_CHARS, answer.length)),
      revealed === 0 ? PENDING_MS : STEP_MS
    );
    return () => window.clearTimeout(id);
  }, [revealed, answer, reducedMotion]);
  const done = revealed >= answer.length;
  const regenerate = () => {
    setDraftIndex((index) => (index + 1) % DRAFTS.length);
    setRevealed(0);
    setVote(null);
    resetCopy();
  };
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
      <ChatMessage align='end'>
        <ChatMessageContent>
          <ChatBubble variant='muted'>
            <ChatBubbleContent>Why did eu-west checkout latency spike at 14:05?</ChatBubbleContent>
          </ChatBubble>
        </ChatMessageContent>
      </ChatMessage>

      <ChatMessage>
        <ChatMessageContent>
          <span role='status' className='sr-only'>
            {done ? 'Reply ready' : revealed === 0 ? 'Generating reply' : ''}
          </span>
          {/*
           * The bubble stays mounted in every state, so aria-busy covers the wait.
           * A ghost bubble drops the padding the footer would otherwise inherit.
           */}
          <ChatBubble variant='ghost' aria-busy={!done}>
            <ChatBubbleContent>
              {revealed === 0 ? (
                <Item size='sm' className='p-0'>
                  <ItemMedia>
                    <Loader />
                  </ItemMedia>
                  <ItemContent>
                    <span>Reading the 14:00 to 14:10 trace...</span>
                  </ItemContent>
                </Item>
              ) : (
                <p className='whitespace-pre-wrap'>
                  {answer.slice(0, revealed)}
                  {done ? null : (
                    <span aria-hidden='true' className='bg-ui-foreground ms-0.5 inline-block h-[1em] w-0.5 translate-y-0.5' />
                  )}
                </p>
              )}
            </ChatBubbleContent>
          </ChatBubble>
          {/*
           * The footer stays mounted so Regenerate keeps focus after its own click.
           * Copy is a one-shot with no aria-pressed; a pressed rating swaps variant.
           */}
          <ChatMessageFooter className='gap-0.5'>
            <span className='pe-1 tabular-nums'>14:45</span>
            <Button
              type='button'
              variant='ghost'
              size='icon-xs'
              disabled={!done}
              aria-label={copied ? 'Reply copied' : 'Copy reply'}
              title={copied ? 'Copied' : 'Copy'}
              onClick={() => void copy(answer)}
            >
              <RegistryIcon lucide={copied ? 'CheckIcon' : 'CopyIcon'} aria-hidden='true' />
            </Button>
            <Button type='button' variant='ghost' size='icon-xs' aria-label='Regenerate reply' title='Regenerate' onClick={regenerate}>
              <RegistryIcon lucide='RefreshCwIcon' aria-hidden='true' />
            </Button>
            {[
              ['up', 'Good reply', 'ThumbsUpIcon'],
              ['down', 'Bad reply', 'ThumbsDownIcon']
            ].map(([value, label, icon]) => (
              <Button
                key={value}
                type='button'
                variant={vote === value ? 'secondary' : 'ghost'}
                size='icon-xs'
                disabled={!done}
                aria-label={label}
                title={label}
                aria-pressed={vote === value}
                onClick={() => setVote(vote === value ? null : value)}
              >
                <RegistryIcon lucide={icon} aria-hidden='true' />
              </Button>
            ))}
          </ChatMessageFooter>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );
}

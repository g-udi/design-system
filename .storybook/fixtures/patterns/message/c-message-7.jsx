'use client';
import { useEffect, useState } from 'react';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Marker,
  MarkerContent,
  MarkerIcon
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import { Message, MessageContent, MessageFooter } from '../../../../src/components/chat/Message/parts/message.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
  const [draftIndex, setDraftIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [vote, setVote] = useState(null);
  const [copied, setCopied] = useState(false);
  const answer = DRAFTS[draftIndex];
  useEffect(() => {
    if (revealed >= answer.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(answer.length);
      return;
    }
    const id = window.setTimeout(
      () => setRevealed((count) => Math.min(count + STEP_CHARS, answer.length)),
      revealed === 0 ? PENDING_MS : STEP_MS
    );
    return () => window.clearTimeout(id);
  }, [revealed, answer]);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);
  const done = revealed >= answer.length;
  const regenerate = () => {
    setDraftIndex((index) => (index + 1) % DRAFTS.length);
    setRevealed(0);
    setVote(null);
  };
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
      <Message align='end'>
        <MessageContent>
          <Bubble variant='muted'>
            <BubbleContent>Why did eu-west checkout latency spike at 14:05?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          <span role='status' className='sr-only'>
            {done ? 'Reply ready' : revealed === 0 ? 'Generating reply' : ''}
          </span>
          {/*
           * The bubble stays mounted in every state, so aria-busy covers the wait.
           * A ghost bubble drops the padding the footer would otherwise inherit.
           */}
          <Bubble variant='ghost' aria-busy={!done}>
            <BubbleContent>
              {revealed === 0 ? (
                <Marker>
                  <MarkerIcon>
                    <Spinner />
                  </MarkerIcon>
                  <MarkerContent>
                    <span className='animate-pulse motion-reduce:animate-none'>Reading the 14:00 to 14:10 trace...</span>
                  </MarkerContent>
                </Marker>
              ) : (
                <p className='whitespace-pre-wrap'>
                  {answer.slice(0, revealed)}
                  {done ? null : (
                    <span aria-hidden='true' className='bg-ui-foreground ms-0.5 inline-block h-[1em] w-0.5 translate-y-0.5' />
                  )}
                </p>
              )}
            </BubbleContent>
          </Bubble>
          {/*
           * The footer stays mounted so Regenerate keeps focus after its own click.
           * Copy is a one-shot with no aria-pressed; a pressed rating swaps variant.
           */}
          <MessageFooter className='gap-0.5'>
            <span className='pe-1 tabular-nums'>14:45</span>
            <Button
              type='button'
              variant='ghost'
              size='icon-xs'
              disabled={!done}
              aria-label={copied ? 'Reply copied' : 'Copy reply'}
              title={copied ? 'Copied' : 'Copy'}
              onClick={() => {
                void navigator.clipboard?.writeText?.(answer);
                setCopied(true);
              }}
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
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

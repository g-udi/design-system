// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useState } from 'react';
import {
  Bubble,
  BubbleContent
} from '../../../../src/components/core/Message/parts/bubble.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Marker,
  MarkerContent,
  MarkerIcon
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import {
  Message,
  MessageContent,
  MessageFooter
} from '../../../../src/components/core/Message/parts/message.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
const ANSWER =
  'The tax service began retrying every confirm call at 14:05, twice at 400ms each, so p95 on POST /api/checkout/confirm went from 240ms to 3.1s. The database was never the bottleneck: connection wait stayed under 5ms for the whole window. Rolling the tax client back to 1.8.3 at 14:41 returned p95 to 260ms within two minutes.';
const PENDING_MS = 900;
const STEP_MS = 24;
const STEP_CHARS = 4;
export function Pattern() {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (revealed >= ANSWER.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(ANSWER.length);
      return;
    }
    const id = window.setTimeout(
      () => setRevealed((count) => Math.min(count + STEP_CHARS, ANSWER.length)),
      revealed === 0 ? PENDING_MS : STEP_MS
    );
    return () => window.clearTimeout(id);
  }, [revealed]);
  const done = revealed >= ANSWER.length;
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
      <Message align='end'>
        <MessageContent>
          <Bubble variant='muted'>
            <BubbleContent>
              Why did eu-west checkout latency spike at 14:05?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          <span role='status' className='sr-only'>
            {done ? 'Reply ready' : revealed === 0 ? 'Generating reply' : ''}
          </span>
          {/*
      The bubble is mounted in both states rather than swapped out, so
      aria-busy covers the wait and the footer keeps its ghost padding.
    */}
          <Bubble variant='ghost' aria-busy={!done}>
            <BubbleContent>
              {revealed === 0 ? (
                <Marker>
                  <MarkerIcon>
                    <Spinner />
                  </MarkerIcon>
                  <MarkerContent>
                    <span className='animate-pulse motion-reduce:animate-none'>
                      Reading the 14:00 to 14:10 trace...
                    </span>
                  </MarkerContent>
                </Marker>
              ) : (
                <p className='whitespace-pre-wrap'>
                  {ANSWER.slice(0, revealed)}
                  {done ? null : (
                    <span
                      aria-hidden='true'
                      className='bg-ui-foreground ms-0.5 inline-block h-[1em] w-0.5 translate-y-0.5'
                    />
                  )}
                </p>
              )}
            </BubbleContent>
          </Bubble>
          {/*
      The footer stays mounted so Replay survives its own click. A button
      that unmounts the moment it is activated drops focus to the body.
    */}
          <MessageFooter className='gap-2'>
            <span className='tabular-nums'>14:45</span>
            <Button
              type='button'
              variant='ghost'
              size='xs'
              onClick={() => setRevealed(0)}
            >
              Replay
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

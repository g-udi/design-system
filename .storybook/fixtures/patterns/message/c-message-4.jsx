'use client';
import { useEffect, useState } from 'react';
import {
  Bubble,
  BubbleContent
} from '../../../../src/components/core/Message/parts/bubble.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Message,
  MessageContent,
  MessageFooter
} from '../../../../src/components/core/Message/parts/message.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const DRAFTS = [
  [
    '4.2 moves invoicing onto the new tax service, so EU orders now carry a VAT line on the PDF, the hosted receipt and the CSV export.',
    'Two smaller changes ride along: the billing portal keeps the filters you left it on, and a failed payment retries twice before it is marked overdue.'
  ],
  [
    'The headline in 4.2 is EU VAT. It is calculated per order rather than per account, and it shows up everywhere an amount does.',
    'We also cleared a long-standing annoyance in the billing portal: filters survive a reload, and overdue is only set after two failed retries.'
  ]
];
export function Pattern() {
  const [draftIndex, setDraftIndex] = useState(0);
  const [vote, setVote] = useState(null);
  const [copied, setCopied] = useState(false);
  const draft = DRAFTS[draftIndex];
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
      <Message align='end'>
        <MessageContent>
          <Bubble variant='muted'>
            <BubbleContent>
              Summarise what changed in 4.2 for the customer note.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          {/*
      A ghost variant anywhere in the row drops the padding the footer
      would otherwise inherit, which sits the toolbar flush with the
      prose. aria-live carries a swapped draft to a screen reader.
    */}
          <Bubble variant='ghost' aria-live='polite'>
            <BubbleContent>
              <div className='space-y-3'>
                {draft.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </BubbleContent>
          </Bubble>
          <MessageFooter className='gap-0.5'>
            <span className='pe-1 tabular-nums'>09:41</span>
            {/*
      Copy is a one-shot, so it carries no aria-pressed. A pressed
      rating swaps variant, because no style tunes a colour override.
    */}
            <Button
              type='button'
              variant='ghost'
              size='icon-xs'
              aria-label={copied ? 'Reply copied' : 'Copy reply'}
              title={copied ? 'Copied' : 'Copy'}
              onClick={() => {
                void navigator.clipboard?.writeText?.(draft.join('\n\n'));
                setCopied(true);
              }}
            >
              {copied ? (
                <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
              ) : (
                <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
              )}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon-xs'
              aria-label='Regenerate reply'
              title='Regenerate'
              onClick={() => {
                setDraftIndex((index) => (index + 1) % DRAFTS.length);
                setVote(null);
              }}
            >
              <RegistryIcon lucide='RefreshCwIcon' aria-hidden='true' />
            </Button>
            <Button
              type='button'
              variant={vote === 'up' ? 'secondary' : 'ghost'}
              size='icon-xs'
              aria-label='Good reply'
              title='Good reply'
              aria-pressed={vote === 'up'}
              onClick={() => setVote(vote === 'up' ? null : 'up')}
            >
              <RegistryIcon lucide='ThumbsUpIcon' aria-hidden='true' />
            </Button>
            <Button
              type='button'
              variant={vote === 'down' ? 'secondary' : 'ghost'}
              size='icon-xs'
              aria-label='Bad reply'
              title='Bad reply'
              aria-pressed={vote === 'down'}
              onClick={() => setVote(vote === 'down' ? null : 'down')}
            >
              <RegistryIcon lucide='ThumbsDownIcon' aria-hidden='true' />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

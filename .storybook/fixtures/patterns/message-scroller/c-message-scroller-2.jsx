'use client';
import { useEffect, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Message, MessageAvatar, MessageContent } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '../../../../src/components/chat/MessageList/parts/message-scroller.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const VIEWER_AVATAR =
  '/avatars/men/32.jpg';
const REPLY_ID = 'th_7c1x8p_reply';
const SETTLED = [
  {
    id: 'th_7c1x8p_1',
    role: 'user',
    author: 'Jonas Weber',
    text: 'I want to reproduce the refund 500 locally before we patch anything.'
  },
  {
    id: 'th_7c1x8p_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Point the Stripe CLI at your local endpoint and trigger charge.refunded.\n\nA dashboard style refund arrives with no payment_intent, which is the exact shape production is failing on.'
  },
  {
    id: 'th_7c1x8p_3',
    role: 'user',
    author: 'Jonas Weber',
    text: 'The CLI payload has a payment_intent on it though.'
  },
  {
    id: 'th_7c1x8p_4',
    role: 'assistant',
    author: 'Gaudi',
    text: 'That is the default fixture. Override the field to null and the handler takes the branch you care about.\n\nThe rest of the fixture can stay as it is, the failing helper reads that one field and nothing else.'
  },
  {
    id: 'th_7c1x8p_5',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Reproduced it, the 500 is right there in the log.'
  },
  {
    id: 'th_7c1x8p_6',
    role: 'assistant',
    author: 'Gaudi',
    text: 'That log line is the lookup helper throwing, three frames above the response.'
  },
  {
    id: 'th_7c1x8p_7',
    role: 'user',
    author: 'Jonas Weber',
    text: 'So what does the smallest safe fix look like?'
  }
];
const REPLY =
  'Move the acknowledgement above the work. Verify the signature, return 200, then hand the event to a queue.\n\nAfter that a null payment_intent is a job that retries on your own backoff, and Stripe sees a healthy endpoint the whole time. It also means one slow refund lookup can no longer time the webhook out.';
export function Pattern() {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (length >= REPLY.length) return;
    const id = window.setTimeout(() => setLength((value) => value + 4), 28);
    return () => window.clearTimeout(id);
  }, [length]);
  const done = length >= REPLY.length;
  const turns = [
    ...SETTLED,
    {
      id: REPLY_ID,
      role: 'assistant',
      author: 'Gaudi',
      text: REPLY.slice(0, length)
    }
  ];
  return (
    /*
     * The frame owns the height and the scroller fills it. Without a bounded
     * parent there is no overflow to follow, and autoScroll has nothing to do
     * because the page itself is doing the scrolling.
     */
    <Card className='h-115 w-full max-w-2xl gap-0 overflow-hidden py-0'>
      <CardHeader className='shrink-0 border-b py-4'>
        <CardTitle>Reproduce webhook failure</CardTitle>
        <CardAction>
          <Badge variant={done ? 'success-light' : 'primary-light'}>
            {done ? 'Answered' : 'Working'}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className='min-h-0 flex-1 p-0'>
        {/*
         * autoScroll follows the output only while the reader is already at the
         * live edge. Any scroll intent releases it and their place is kept, and
         * the jump to latest control re-engages it.
         */}
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport aria-label='Live agent run transcript'>
              {/*
               * aria-busy silences the log while tokens land, so the finished
               * row is announced once instead of per chunk. That is why the in
               * flight state is announced from a status node outside it, and
               * why the spinner itself is hidden from assistive tech.
               */}
              <MessageScrollerContent
                aria-busy={!done}
                className='gap-4 p-(--card-spacing)'
              >
                {turns.map((turn) => {
                  const isUser = turn.role === 'user';
                  const isStreaming = turn.id === REPLY_ID && !done;
                  return (
                    <MessageScrollerItem
                      key={turn.id}
                      messageId={turn.id}
                      scrollAnchor={isUser}
                    >
                      <Message align={isUser ? 'end' : 'start'}>
                        <MessageAvatar className='size-8'>
                          {isUser ? (
                            <Avatar>
                              <AvatarImage
                                src={VIEWER_AVATAR}
                                alt={turn.author}
                              />
                              <AvatarFallback>JW</AvatarFallback>
                            </Avatar>
                          ) : (
                            <>
                              <RegistryIcon
                                lucide='SparklesIcon'
                                aria-hidden='true'
                                className='text-ui-muted-foreground size-4'
                              />
                              <span className='sr-only'>{turn.author}</span>
                            </>
                          )}
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble
                            variant={isUser ? 'muted' : 'ghost'}
                            align={isUser ? 'end' : 'start'}
                          >
                            <BubbleContent className='space-y-2'>
                              {turn.text
                                .split('\n\n')
                                .map((paragraph, index) => (
                                  <p
                                    key={index}
                                    className='whitespace-pre-wrap'
                                  >
                                    {paragraph}
                                  </p>
                                ))}
                              {isStreaming ? (
                                <Spinner
                                  className='size-3'
                                  aria-hidden='true'
                                />
                              ) : null}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                })}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <p role='status' aria-live='polite' className='sr-only'>
              {done ? 'Reply complete' : 'Gaudi is replying'}
            </p>
            <MessageScrollerButton
              variant='outline'
              className='rounded-full shadow-sm'
            />
          </MessageScroller>
        </MessageScrollerProvider>
      </CardContent>
      <CardFooter className='shrink-0 border-t py-4'>
        <Button variant='outline' size='sm' onClick={() => setLength(0)}>
          Replay stream
        </Button>
      </CardFooter>
    </Card>
  );
}

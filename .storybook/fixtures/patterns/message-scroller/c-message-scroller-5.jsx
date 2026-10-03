'use client';
import { useEffect, useRef, useState } from 'react';
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
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Marker,
  MarkerContent
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import { Message, MessageAvatar, MessageContent } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScrollerScrollable } from '../../../../src/components/chat/MessageList/parts/message-scroller.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const VIEWER_AVATAR =
  '/avatars/men/32.jpg';
const INITIAL_VISIBLE = 6;
const HISTORY = [
  {
    id: 'th_5p3w9k_1',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Pulling up ticket 4821. The customer says their exports have been empty since Friday.'
  },
  {
    id: 'th_5p3w9k_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Empty, not failing. Every job in that window finished with a zero row result.'
  },
  {
    id: 'th_5p3w9k_3',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Same workspace every time?'
  },
  {
    id: 'th_5p3w9k_4',
    role: 'assistant',
    author: 'Gaudi',
    text: 'One workspace, ws_3311. No other account shows the pattern.'
  },
  {
    id: 'th_5p3w9k_5',
    role: 'user',
    author: 'Jonas Weber',
    text: 'What changed for them on Friday?'
  },
  {
    id: 'th_5p3w9k_6',
    role: 'assistant',
    author: 'Gaudi',
    text: 'They moved their default view onto a saved filter whose date range ends last Thursday.'
  },
  {
    id: 'th_5p3w9k_7',
    role: 'user',
    author: 'Jonas Weber',
    text: 'So the export is right and the filter is wrong.'
  },
  {
    id: 'th_5p3w9k_8',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Right for the filter, yes. The export inherits the active view, and that view now excludes everything recent.'
  },
  {
    id: 'th_5p3w9k_9',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Does the interface show them that range anywhere?'
  },
  {
    id: 'th_5p3w9k_10',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Only inside the filter chip, which is collapsed by default at their screen width.'
  },
  {
    id: 'th_5p3w9k_11',
    role: 'user',
    author: 'Jonas Weber',
    text: 'That is the actual bug then.'
  },
  {
    id: 'th_5p3w9k_12',
    role: 'assistant',
    author: 'Gaudi',
    text: 'It is at least why nobody caught it. The export dialog does show a row count, but it renders after the request, so a zero reads as loading.'
  },
  {
    id: 'th_5p3w9k_13',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Can we tell them what to change today?'
  },
  {
    id: 'th_5p3w9k_14',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Clear the saved range on the view, or export from the unfiltered table. Either one gives them Friday onward straight away.'
  },
  {
    id: 'th_5p3w9k_15',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Send that, then flag the dialog for the product review.'
  },
  {
    id: 'th_5p3w9k_16',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Sent, and the dialog is on the review list with a screenshot attached.\n\nI left a note on the ticket too, so the next person reads the filter before they open the worker logs.'
  }
];
function HistoryChip() {
  const { start } = useMessageScrollerScrollable();
  return (
    <Badge variant='info-light'>
      {start ? 'Earlier messages above' : 'Top of thread'}
    </Badge>
  );
}
export function Pattern() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [loading, setLoading] = useState(false);
  const loadTimer = useRef(null);
  useEffect(() => {
    return () => {
      if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
    };
  }, []);
  const visible = HISTORY.slice(-visibleCount);
  const allLoaded = visibleCount >= HISTORY.length;
  function loadEarlier() {
    if (loading || allLoaded) return;
    setLoading(true);
    loadTimer.current = window.setTimeout(() => {
      loadTimer.current = null;
      setVisibleCount((count) => Math.min(count + 5, HISTORY.length));
      setLoading(false);
    }, 700);
  }
  return (
    /*
     * The frame owns the height. Restoring a scroll position only means
     * something while the reader is inside a bounded region, so a card that
     * grew with its content would have nothing to preserve.
     */
    <Card className='h-110 w-full max-w-2xl gap-0 overflow-hidden py-0'>
      <MessageScrollerProvider>
        {/*
         * The load control lives in the header, never as the first row of the
         * content. A prepend is detected by the previously first row moving to
         * an index above zero, so a permanent loader row at the top never moves
         * and the restore would never fire.
         */}
        <CardHeader className='shrink-0 border-b py-4'>
          <CardTitle>Support escalation</CardTitle>
          <CardDescription className='flex items-center gap-2'>
            <HistoryChip />
            <span>
              {visible.length} of {HISTORY.length} messages
            </span>
          </CardDescription>
          <CardAction>
            <Button
              variant='outline'
              size='sm'
              disabled={loading || allLoaded}
              onClick={loadEarlier}
            >
              {loading ? (
                <Spinner className='size-3' aria-hidden='true' />
              ) : null}
              {allLoaded ? 'All loaded' : 'Load earlier'}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='min-h-0 flex-1 p-0'>
          <MessageScroller>
            {/*
             * preserveScrollOnPrepend is on by default. Stable ids are what
             * give it a specific row to hold under the reader, so a list keyed
             * by index loses the behavior without any error.
             */}
            <MessageScrollerViewport aria-label='Support escalation transcript'>
              <MessageScrollerContent className='gap-4 p-(--card-spacing)'>
                {visible.map((turn) => {
                  const isUser = turn.role === 'user';
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
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                })}
                {/*
                 * A row with no messageId still counts for prepend detection
                 * and for anchoring, it is only invisible to scrollToMessage
                 * and to visibility tracking. A divider wants exactly that.
                 */}
                <MessageScrollerItem scrollAnchor={false}>
                  <Marker variant='separator'>
                    <MarkerContent>Escalated to Sam Okafor</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton
              variant='outline'
              className='rounded-full shadow-sm'
            />
          </MessageScroller>
        </CardContent>
      </MessageScrollerProvider>
    </Card>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { Separator } from '@gaudi/design-system/core/Separator';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport, useMessageScrollerScrollable } from '@gaudi/design-system/chat/ChatMessageList';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const VIEWER_AVATAR =
  '/avatars/person-41.svg';
const INITIAL_VISIBLE = 6;
const HISTORY = [
  {
    id: 'th_5p3w9k_1',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Opening ticket 1907. An author says their RSS feed has listed no posts since Friday.'
  },
  {
    id: 'th_5p3w9k_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Empty, but valid. Every feed request in that window returned a well-formed document with no items.'
  },
  {
    id: 'th_5p3w9k_3',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Only that one site?'
  },
  {
    id: 'th_5p3w9k_4',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Only that site, studio-notes. No other publication shows the pattern.'
  },
  {
    id: 'th_5p3w9k_5',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'What did they change on Friday?'
  },
  {
    id: 'th_5p3w9k_6',
    role: 'assistant',
    author: 'Gaudi',
    text: 'They pointed the feed at a saved collection whose publish window closed last Thursday.'
  },
  {
    id: 'th_5p3w9k_7',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'So the feed works and the collection is wrong.'
  },
  {
    id: 'th_5p3w9k_8',
    role: 'assistant',
    author: 'Gaudi',
    text: 'The feed is right for that collection. It follows whichever collection is selected, and that one now leaves out every recent post.'
  },
  {
    id: 'th_5p3w9k_9',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Do the feed settings show that window anywhere?'
  },
  {
    id: 'th_5p3w9k_10',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Only inside the collection filter, which is folded away at their window size.'
  },
  {
    id: 'th_5p3w9k_11',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Then that is the real problem.'
  },
  {
    id: 'th_5p3w9k_12',
    role: 'assistant',
    author: 'Gaudi',
    text: 'It is at least why nobody noticed. The feed preview does show an item count, but it loads after the settings panel, so a zero looks like it is still loading.'
  },
  {
    id: 'th_5p3w9k_13',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'What can they change right now?'
  },
  {
    id: 'th_5p3w9k_14',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Remove the publish window from the collection, or point the feed back at all posts. Either one brings back everything since Friday at once.'
  },
  {
    id: 'th_5p3w9k_15',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Send that, and add the feed preview to the next design review.'
  },
  {
    id: 'th_5p3w9k_16',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Sent, and the preview is on the review list with a screenshot.\n\nI also noted it on the ticket, so the next person checks the collection before digging through feed logs.'
  }
];
function HistoryChip() {
  const { start } = useMessageScrollerScrollable();
  return (
    <Badge variant='info-light'>
      {start ? 'Older messages above' : 'Start of conversation'}
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
      <ChatMessageScrollerProvider>
        {/*
         * The load control lives in the header, never as the first row of the
         * content. A prepend is detected by the previously first row moving to
         * an index above zero, so a permanent loader row at the top never moves
         * and the restore would never fire.
         */}
        <CardHeader className='shrink-0 border-b py-4'>
          <CardTitle>Author support</CardTitle>
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
                <Loader className='size-3' aria-hidden='true' />
              ) : null}
              {allLoaded ? 'All loaded' : 'Load earlier'}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='min-h-0 flex-1 p-0'>
          <ChatMessageScroller>
            {/*
             * preserveScrollOnPrepend is on by default. Stable ids are what
             * give it a specific row to hold under the reader, so a list keyed
             * by index loses the behavior without any error.
             */}
            <ChatMessageScrollerViewport aria-label='Author support thread'>
              <ChatMessageScrollerContent className='gap-4 p-(--card-spacing)'>
                {visible.map((turn) => {
                  const isUser = turn.role === 'user';
                  return (
                    <ChatMessageScrollerItem
                      key={turn.id}
                      messageId={turn.id}
                      scrollAnchor={isUser}
                    >
                      <ChatMessage align={isUser ? 'end' : 'start'}>
                        <ChatMessageAvatar className='size-8'>
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
                        </ChatMessageAvatar>
                        <ChatMessageContent>
                          <ChatBubble
                            variant={isUser ? 'muted' : 'ghost'}
                            align={isUser ? 'end' : 'start'}
                          >
                            <ChatBubbleContent className='space-y-2'>
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
                            </ChatBubbleContent>
                          </ChatBubble>
                        </ChatMessageContent>
                      </ChatMessage>
                    </ChatMessageScrollerItem>
                  );
                })}
                {/*
                 * A row with no messageId still counts for prepend detection
                 * and for anchoring, it is only invisible to scrollToMessage
                 * and to visibility tracking. A divider wants exactly that.
                 */}
                <ChatMessageScrollerItem scrollAnchor={false}>
                  <div className='text-text-muted flex items-center gap-3 text-xs'>
                    <Separator className='min-w-3 flex-1' />
                    <span className='min-w-0'>Handed to Ines Calder</span>
                  <Separator className='min-w-3 flex-1' />
                  </div>
                </ChatMessageScrollerItem>
              </ChatMessageScrollerContent>
            </ChatMessageScrollerViewport>
            <ChatMessageScrollerButton
              variant='outline'
              className='rounded-full shadow-sm'
            />
          </ChatMessageScroller>
        </CardContent>
      </ChatMessageScrollerProvider>
    </Card>
  );
}

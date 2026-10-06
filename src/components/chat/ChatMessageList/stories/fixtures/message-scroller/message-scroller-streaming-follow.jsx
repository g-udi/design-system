'use client';
import { useEffect, useState } from 'react';
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
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const VIEWER_AVATAR =
  '/avatars/person-41.svg';
const REPLY_ID = 'th_7c1x8p_reply';
const SETTLED = [
  {
    id: 'th_7c1x8p_1',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'I want to reproduce the broken cover images locally before we change anything.'
  },
  {
    id: 'th_7c1x8p_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Run the media worker locally and replay an upload event from the fixtures folder.\n\nAn upload from the mobile editor arrives without a focal point, which is exactly the shape production is failing on.'
  },
  {
    id: 'th_7c1x8p_3',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'The fixture already has a focal point on it though.'
  },
  {
    id: 'th_7c1x8p_4',
    role: 'assistant',
    author: 'Gaudi',
    text: 'That is the default fixture. Set the field to null and the cropper takes the path you care about.\n\nThe rest of the fixture can stay as it is. The failing step reads that one field and nothing else.'
  },
  {
    id: 'th_7c1x8p_5',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Reproduced it, the crash is right there in the log.'
  },
  {
    id: 'th_7c1x8p_6',
    role: 'assistant',
    author: 'Gaudi',
    text: 'That log line is the crop helper throwing, three frames above the response.'
  },
  {
    id: 'th_7c1x8p_7',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'What is the smallest safe fix?'
  }
];
const REPLY =
  'Accept the upload before processing it. Store the original, return 200, then queue the crop as a job.\n\nAfter that a missing focal point becomes a job that retries with a centred crop, and the editor always sees a successful upload. It also means one slow image can no longer time the request out.';
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
        <CardTitle>Reproduce the cover crop failure</CardTitle>
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
        <ChatMessageScrollerProvider autoScroll>
          <ChatMessageScroller>
            <ChatMessageScrollerViewport aria-label='Live debugging thread'>
              {/*
               * aria-busy silences the log while tokens land, so the finished
               * row is announced once instead of per chunk. That is why the in
               * flight state is announced from a status node outside it, and
               * why the spinner itself is hidden from assistive tech.
               */}
              <ChatMessageScrollerContent
                aria-busy={!done}
                className='gap-4 p-(--card-spacing)'
              >
                {turns.map((turn) => {
                  const isUser = turn.role === 'user';
                  const isStreaming = turn.id === REPLY_ID && !done;
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
                              {isStreaming ? (
                                <Loader
                                  className='size-3'
                                  aria-hidden='true'
                                />
                              ) : null}
                            </ChatBubbleContent>
                          </ChatBubble>
                        </ChatMessageContent>
                      </ChatMessage>
                    </ChatMessageScrollerItem>
                  );
                })}
              </ChatMessageScrollerContent>
            </ChatMessageScrollerViewport>
            <p role='status' aria-live='polite' className='sr-only'>
              {done ? 'Reply complete' : 'Gaudi is replying'}
            </p>
            <ChatMessageScrollerButton
              variant='outline'
              className='rounded-full shadow-sm'
            />
          </ChatMessageScroller>
        </ChatMessageScrollerProvider>
      </CardContent>
      <CardFooter className='shrink-0 border-t py-4'>
        <Button variant='outline' size='sm' onClick={() => setLength(0)}>
          Replay stream
        </Button>
      </CardFooter>
    </Card>
  );
}

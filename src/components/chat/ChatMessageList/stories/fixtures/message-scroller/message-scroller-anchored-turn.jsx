'use client';
import { useEffect, useRef, useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const VIEWER_AVATAR =
  '/avatars/person-41.svg';
const SEEDED = [
  {
    id: 'th_4b8t2v_1',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Summarise the changes merged this week for the Friday newsletter.'
  },
  {
    id: 'th_4b8t2v_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Here is a first draft, ordered the way the last issue was.\n\nTwo items need your call. The new reading-time estimate changes numbers readers already see, and the thumbnail cropping fix alters existing cover images.'
  },
  {
    id: 'th_4b8t2v_3',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Lead with the reading-time change.'
  },
  {
    id: 'th_4b8t2v_4',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Done. Visible changes come first, then new features, then small fixes.\n\nI also lifted the thumbnail note out of the fixes, because the authors who skim that list are the ones it affects.'
  },
  {
    id: 'th_4b8t2v_5',
    role: 'assistant',
    author: 'Gaudi',
    text: 'The draft is in the newsletter editor. Point at any paragraph and I will rework it there.'
  }
];
const REPLIES = [
  'Added to the draft. It sits under Visible changes, with a one-line note on what authors should check.\n\nI kept it short, because the full explanation lives on the help page it links to.',
  'Rewritten, with the earlier version kept alongside so you can compare them.\n\nNothing else changed. The order is still visible changes, then features, then fixes.',
  'That item needs a choice more than a rewrite. It only applies to sites that switch the option on, so it is news for some readers and noise for the rest.\n\nTell me which audience to write for and I will draft both.'
];
export function Pattern() {
  const [sent, setSent] = useState([]);
  const [draft, setDraft] = useState('');
  const replyTimer = useRef(null);
  const replyCount = useRef(0);
  useEffect(() => {
    return () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    };
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    const round = replyCount.current;
    replyCount.current += 1;
    setDraft('');
    setSent((current) => [
      ...current,
      {
        id: `th_4b8t2v_q${round}`,
        role: 'user',
        author: 'Teo Abernathy',
        text: question
      }
    ]);
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      replyTimer.current = null;
      setSent((current) => [
        ...current,
        {
          id: `th_4b8t2v_a${round}`,
          role: 'assistant',
          author: 'Gaudi',
          text: REPLIES[round % REPLIES.length]
        }
      ]);
    }, 900);
  }
  const turns = [...SEEDED, ...sent];
  return (
    /*
     * The frame owns the height, so the transcript overflows inside the card
     * rather than lengthening the page. An anchored turn needs somewhere to
     * move to, and a page tall enough to fit everything gives it nowhere.
     */
    <Card className='h-120 w-full max-w-2xl gap-0 overflow-hidden py-0'>
      <CardHeader className='shrink-0 border-b py-4'>
        <CardTitle>Friday newsletter draft</CardTitle>
        <CardDescription>New turns anchor with a 64px peek</CardDescription>
      </CardHeader>
      <CardContent className='min-h-0 flex-1 p-0'>
        {/*
         * The peek is only read on a row that carries scrollAnchor, so in a
         * transcript with no anchors both props are inert and the view falls
         * back to plain bottom following.
         */}
        <ChatMessageScrollerProvider scrollPreviousItemPeek={64} scrollMargin={16}>
          <ChatMessageScroller>
            <ChatMessageScrollerViewport aria-label='Newsletter drafting thread'>
              <ChatMessageScrollerContent className='gap-4 p-(--card-spacing)'>
                {turns.map((turn) => {
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
              </ChatMessageScrollerContent>
            </ChatMessageScrollerViewport>
            <ChatMessageScrollerButton
              variant='outline'
              className='rounded-full shadow-sm'
            />
          </ChatMessageScroller>
        </ChatMessageScrollerProvider>
      </CardContent>
      <CardFooter className='shrink-0 border-t py-4'>
        {/*
         * A real form, so the button and Enter inside the field go through one
         * handler. An onClick only button is still reachable by keyboard, but it
         * leaves Enter in the field doing nothing at all.
         */}
        <form className='w-full' onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroupInput
              aria-label='Message Gaudi'
              placeholder='Ask about the newsletter draft'
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                type='submit'
                size='icon-sm'
                variant='default'
                disabled={!draft.trim()}
              >
                <RegistryIcon lucide='ArrowUpIcon' aria-hidden='true' />
                <span className='sr-only'>Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardFooter>
    </Card>
  );
}

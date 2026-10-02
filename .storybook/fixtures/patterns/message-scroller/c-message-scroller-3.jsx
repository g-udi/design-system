'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Message, MessageAvatar, MessageContent } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '../../../../src/components/chat/MessageList/parts/message-scroller.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const VIEWER_AVATAR =
  'https://randomuser.me/api/portraits/men/32.jpg';
const SEEDED = [
  {
    id: 'th_4b8t2v_1',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Draft the release notes for 3.4 from the merged pull requests.'
  },
  {
    id: 'th_4b8t2v_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Here is a first pass, grouped the way the changelog already reads.\n\nTwo entries need a decision from you. The webhook acknowledgement change is breaking for anyone parsing the 500, and the export worker change moves a default.'
  },
  {
    id: 'th_4b8t2v_3',
    role: 'user',
    author: 'Jonas Weber',
    text: 'Keep the breaking one at the top.'
  },
  {
    id: 'th_4b8t2v_4',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Moved. Breaking changes lead, then features, then fixes.\n\nI also pulled the migration note out of the fix list, because the people who skip that section are the ones who need it.'
  },
  {
    id: 'th_4b8t2v_5',
    role: 'assistant',
    author: 'Gaudi',
    text: 'The draft is in the shared doc. Ask for any section and I will rewrite it in place.'
  }
];
const REPLIES = [
  'Pulled that into the draft. It sits under Breaking changes with the upgrade note directly beneath it.\n\nI kept the wording to a single line, since the detail belongs on the docs page the entry links to.',
  'Done, and I left the previous text beside it so you can compare the two.\n\nNothing else moved. The ordering rules are still breaking, then features, then fixes.',
  'That one needs a decision rather than an edit. The change sits behind a flag, so it reads as a feature for anyone who opts in and as nothing at all for everyone else.\n\nTell me which framing you want and I will write it both ways.'
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
        author: 'Jonas Weber',
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
        <CardTitle>Q3 release notes draft</CardTitle>
        <CardDescription>Anchored turns, 64px peek</CardDescription>
      </CardHeader>
      <CardContent className='min-h-0 flex-1 p-0'>
        {/*
         * The peek is only read on a row that carries scrollAnchor, so in a
         * transcript with no anchors both props are inert and the view falls
         * back to plain bottom following.
         */}
        <MessageScrollerProvider scrollPreviousItemPeek={64} scrollMargin={16}>
          <MessageScroller>
            <MessageScrollerViewport aria-label='Release notes thread'>
              <MessageScrollerContent className='gap-4 p-(--card-spacing)'>
                {turns.map((turn) => {
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
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton
              variant='outline'
              className='rounded-full shadow-sm'
            />
          </MessageScroller>
        </MessageScrollerProvider>
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
              placeholder='Ask about the 3.4 release notes'
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

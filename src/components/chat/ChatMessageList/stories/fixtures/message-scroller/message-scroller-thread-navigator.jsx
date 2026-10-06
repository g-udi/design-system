'use client';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport, useMessageScroller, useMessageScrollerVisibility } from '@gaudi/design-system/chat/ChatMessageList';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const VIEWER_AVATAR =
  '/avatars/person-41.svg';
const TURNS = [
  {
    id: 'th_8n4d7s_q1',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Walk me through the feed outage from Friday.'
  },
  {
    id: 'th_8n4d7s_2',
    role: 'assistant',
    author: 'Gaudi',
    text: 'It ran from 09:42 to 11:06. One site served an empty RSS feed and nobody saw an error.\n\nThe trigger was a saved collection whose publish window excluded every recent post, and the feed follows the selected collection.'
  },
  {
    id: 'th_8n4d7s_3',
    role: 'assistant',
    author: 'Gaudi',
    text: 'No posts were lost, and no other site was affected.'
  },
  {
    id: 'th_8n4d7s_q2',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Why did it take 84 minutes to spot?'
  },
  {
    id: 'th_8n4d7s_5',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Because every signal looked healthy. Requests succeeded, the cache refreshed, and the error rate never moved.\n\nWe found it when support linked the ticket to the collection change, not from an alert.'
  },
  {
    id: 'th_8n4d7s_q3',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'What would have flagged it sooner?'
  },
  {
    id: 'th_8n4d7s_7',
    role: 'assistant',
    author: 'Gaudi',
    text: 'An empty feed from a site that published dozens of posts the week before. That is the signal we do not have yet.\n\nIt is cheap to add, because the feed builder already records how many items it wrote.'
  },
  {
    id: 'th_8n4d7s_8',
    role: 'assistant',
    author: 'Gaudi',
    text: 'I wrote the threshold as a ratio rather than a fixed number, so a genuinely quiet site never pages anyone.'
  },
  {
    id: 'th_8n4d7s_q4',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Is the preview change still the right fix?'
  },
  {
    id: 'th_8n4d7s_10',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Yes, and it is worth doing alongside the alert. The preview loads its item count after the settings panel, so a zero currently looks like it is still loading.\n\nShowing the selected collection with a settled count turns a silent wrong answer into an obvious one.'
  },
  {
    id: 'th_8n4d7s_q5',
    role: 'user',
    author: 'Teo Abernathy',
    text: 'Write it up for the retrospective on Thursday.'
  },
  {
    id: 'th_8n4d7s_12',
    role: 'assistant',
    author: 'Gaudi',
    text: 'Done. Timeline, contributing factors, and the two follow-ups with owners and dates.\n\nI kept the blameless tone and moved the raw timeline to an appendix, so the meeting can focus on the follow-ups.'
  }
];
const QUESTIONS = TURNS.filter((turn) => turn.role === 'user');
function TurnNavigator() {
  const { scrollToMessage } = useMessageScroller();
  const { currentAnchorId } = useMessageScrollerVisibility();
  const index = Math.max(
    0,
    QUESTIONS.findIndex((question) => question.id === currentAnchorId)
  );
  const current = QUESTIONS[index];
  function goTo(nextIndex) {
    const target = QUESTIONS[nextIndex];
    if (!target) return;
    scrollToMessage(target.id, { align: 'start', behavior: 'smooth' });
  }
  return (
    <div className='flex w-full min-w-0 items-center gap-2'>
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Previous turn'
        disabled={index <= 0}
        onClick={() => goTo(index - 1)}
      >
        <RegistryIcon lucide='ChevronUpIcon' aria-hidden='true' />
      </Button>
      <span className='text-ui-muted-foreground min-w-0 flex-1 truncate text-center text-sm'>
        <span className='text-ui-foreground font-medium'>
          Turn {index + 1} of {QUESTIONS.length}
        </span>{' '}
        {current.text}
      </span>
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Next turn'
        disabled={index >= QUESTIONS.length - 1}
        onClick={() => goTo(index + 1)}
      >
        <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
      </Button>
    </div>
  );
}
export function Pattern() {
  return (
    /*
     * The frame owns the height, and the Provider wraps the whole card body so
     * the footer can read and drive the transcript while sitting outside the
     * scroll region.
     */
    <Card className='h-115 w-full max-w-2xl gap-0 overflow-hidden py-0'>
      <ChatMessageScrollerProvider scrollMargin={12}>
        <CardHeader className='shrink-0 border-b py-4'>
          <CardTitle>Feed outage retrospective</CardTitle>
          <CardDescription>5 questions, 12 messages</CardDescription>
        </CardHeader>
        <CardContent className='min-h-0 flex-1 p-0'>
          <ChatMessageScroller>
            <ChatMessageScrollerViewport aria-label='Retrospective thread'>
              <ChatMessageScrollerContent className='gap-4 p-(--card-spacing)'>
                {TURNS.map((turn) => {
                  const isUser = turn.role === 'user';
                  return (
                    /*
                     * Only the questions carry an anchor, so the reported
                     * anchor stays on a turn after it scrolls above the fold.
                     * That is what makes it answer where the reader is rather
                     * than what happens to be on screen.
                     */
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
        </CardContent>
        <CardFooter className='shrink-0 border-t py-4'>
          {/*
           * Visibility tracking only runs while something subscribes to it, so
           * a transcript without a navigator pays nothing for the observer this
           * footer turns on.
           */}
          <TurnNavigator />
        </CardFooter>
      </ChatMessageScrollerProvider>
    </Card>
  );
}

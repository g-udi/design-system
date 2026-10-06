'use client';
import { useState } from 'react';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { Separator } from '@gaudi/design-system/core/Separator';
import { ChatMessage, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
const POSITIONS = ['start', 'end', 'last-anchor'];
const TURNS = [
  {
    id: 'th_2m6r7d_1',
    role: 'user',
    text: 'Newsletter unsubscribes rose again this month. Where are they coming from?'
  },
  {
    id: 'th_2m6r7d_2',
    role: 'assistant',
    text: 'Mostly from readers who joined through the free style guide, and mostly within their first two weeks.\n\nReaders who signed up from articles or referrals are flat, so nothing here points at the regular issues.'
  },
  {
    id: 'th_2m6r7d_3',
    role: 'user',
    text: 'Is it the same readers each month?'
  },
  {
    id: 'th_2m6r7d_4',
    role: 'assistant',
    text: 'No. The style guide signups turn over completely, which points to a first impression problem rather than slow fatigue.\n\nReaders who stay past the third issue behave like every other group we track.'
  },
  {
    id: 'th_2m6r7d_5',
    role: 'user',
    text: 'What do they do before they unsubscribe?'
  },
  {
    id: 'th_2m6r7d_6',
    role: 'assistant',
    text: 'They download the guide, open the welcome email, and never click through to an article.\n\nOne article visit is the strongest signal we have. Readers who open one in their first week leave at about a third of the rate.'
  },
  {
    id: 'th_2m6r7d_7',
    role: 'user',
    text: 'Give me the full breakdown so I can bring it to the editorial meeting.'
  },
  {
    id: 'th_2m6r7d_8',
    role: 'assistant',
    text: 'Guide signups are 81 percent of unsubscribes and 12 percent of opens, so the effect on reach is much smaller than the count suggests. Median time before leaving is 16 days.\n\nArticle signups are 11 percent of unsubscribes and 52 percent of opens, with a median stay of over ten months, and most of those moved to the weekly digest rather than leaving. Referrals are the remaining 8 percent and follow the usual seasonal pattern.\n\nThe suggestion is to stop reading this as one number. Guide churn belongs to the welcome sequence, article churn is a question of sending frequency, and referral churn needs no action.'
  }
];
export function Pattern() {
  const [position, setPosition] = useState('last-anchor');
  return (
    <Card className='h-120 w-full max-w-2xl gap-0 overflow-hidden py-0'>
      <CardHeader className='shrink-0 border-b py-4'>
        <CardTitle>Unsubscribes by signup source</CardTitle>
        <CardDescription>Opened again on Tuesday</CardDescription>
      </CardHeader>
      <CardContent className='min-h-0 flex-1 p-0'>
        {/*
         * defaultScrollPosition decides where a thread opens, it is not a
         * scroll command. The provider re-applies it whenever the value
         * changes, so a tab reads as reopening the thread rather than moving
         * inside it.
         */}
        <ChatMessageScrollerProvider defaultScrollPosition={position}>
          <ChatMessageScroller>
            <ChatMessageScrollerViewport aria-label='Saved analytics thread'>
              <ChatMessageScrollerContent className='gap-4 p-(--card-spacing)'>
                {/*
                 * The day divider gives the start position something to land
                 * on. Without a leading row, start and the first turn resolve
                 * to the same pixel and the option looks broken.
                 */}
                <ChatMessageScrollerItem scrollAnchor={false}>
                  <div className='text-text-muted flex items-center gap-3 text-xs'>
                    <Separator className='min-w-3 flex-1' />
                    <span className='min-w-0'>Tuesday</span>
                  <Separator className='min-w-3 flex-1' />
                  </div>
                </ChatMessageScrollerItem>
                {TURNS.map((turn) => {
                  const isUser = turn.role === 'user';
                  return (
                    /*
                     * last-anchor keys on scrollAnchor, not on the role. With
                     * no anchor in the tree, or when the last turn already fits
                     * the viewport, it falls back to end.
                     */
                    <ChatMessageScrollerItem
                      key={turn.id}
                      messageId={turn.id}
                      scrollAnchor={isUser}
                    >
                      <ChatMessage align={isUser ? 'end' : 'start'}>
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
         * The twins hand this callback different argument types, so the value
         * is narrowed here rather than cast at the call site. One body then
         * compiles and behaves identically in both.
         */}
        <ToggleGroup
          type='single'
          value={position}
          onValueChange={(value) => {
            if (
              value === 'start' ||
              value === 'end' ||
              value === 'last-anchor'
            ) {
              setPosition(value);
            }
          }}
          className='w-full'
        >
          <div className='w-full'>
            {POSITIONS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </div>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}

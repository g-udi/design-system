'use client';
import { useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent, ChatBubbleGroup, ChatBubbleReactions } from '@gaudi/design-system/chat/ChatBubble';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';

// Consecutive turns from one sender share a ChatBubbleGroup; the group's tighter
// gap against the thread gap is the whole grouping signal.
const thread = [
  { id: 'g1', from: 'you', lines: ['My annual membership was charged twice on Tuesday. Can you take a look?'] },
  {
    id: 'g2',
    from: 'agent',
    seen: true,
    lines: [
      'Checking now. I can see two payments for membership M-2207, both for £96.00.',
      'The second one came from a page refresh during checkout, so only the first should have gone through.'
    ]
  },
  { id: 'g3', from: 'you', lines: ['That matches my statement. Please cancel the duplicate.'] },
  { id: 'g4', from: 'agent', lines: ['Cancelled. The money returns to your card within 3 to 5 working days.'], reactions: true }
];

export function Pattern() {
  const [reacted, setReacted] = useState(false);
  const thanks = reacted ? 2 : 1;
  return (
    // The reaction pill rings itself in the card colour, so the thread sits on a Card.
    <Card className='mx-auto w-full max-w-sm'>
      {/* CardHeader is a grid by default; the flex override puts the avatar and name on one row. */}
      <CardHeader className='flex flex-row items-center gap-3 border-b'>
        <Avatar size='sm'>
          <AvatarImage src='/avatars/person-19.svg' alt='Saskia Ortelius' />
          <AvatarFallback>SO</AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-col gap-1'>
          <CardTitle>Saskia Ortelius</CardTitle>
          <CardDescription>Membership support, replies in a few minutes</CardDescription>
        </div>
      </CardHeader>
      {/* align="end" resolves to align-self, so the turns must sit in a flex column. */}
      <CardContent className='flex flex-col gap-3'>
        {thread.map((group) => {
          const you = group.from === 'you';
          return (
            // align stays on each ChatBubble: the group stretches and has no side of its own.
            <ChatBubbleGroup key={group.id} className={group.reactions ? 'mb-4' : group.seen ? 'mt-4' : undefined}>
              {/* Side and variant are visual only, so the group names its sender once. */}
              <span className='sr-only'>{you ? 'You said: ' : 'Lena said: '}</span>
              {group.lines.map((line, index) => (
                <ChatBubble key={line} align={you ? 'end' : 'start'} variant={you ? 'default' : 'muted'}>
                  <ChatBubbleContent>{line}</ChatBubbleContent>
                  {group.seen && index === 0 ? (
                    // A static row reads as one image with a spoken summary; side='top' anchors it above.
                    <ChatBubbleReactions side='top' align='start' role='img' aria-label='Reactions: eyes and thumbs up'>
                      <span>👀</span>
                      <span>👍</span>
                    </ChatBubbleReactions>
                  ) : null}
                  {group.reactions && index === group.lines.length - 1 ? (
                    // The row collapses its own padding once it holds a button,
                    // so the single control is the hit area.
                    <ChatBubbleReactions>
                      <Button
                        variant='ghost'
                        size='xs'
                        className='hover:bg-ui-foreground/10 dark:hover:bg-ui-foreground/15 rounded-[inherit]'
                        aria-pressed={reacted}
                        aria-label={`React with thanks, ${thanks} so far`}
                        onClick={() => setReacted((value) => !value)}
                      >
                        <span aria-hidden='true'>🙏</span>
                        <span className='group-aria-pressed/button:text-ui-primary tabular-nums'>{thanks}</span>
                      </Button>
                    </ChatBubbleReactions>
                  ) : null}
                </ChatBubble>
              ))}
            </ChatBubbleGroup>
          );
        })}
        <p className='self-end text-xs text-ui-muted-foreground'>Delivered 9:41</p>
      </CardContent>
    </Card>
  );
}

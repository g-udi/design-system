'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';

// Consecutive turns from one sender share a BubbleGroup; the group's tighter
// gap against the thread gap is the whole grouping signal.
const thread = [
  { id: 'g1', from: 'you', lines: ['Invoice INV-4417 was charged twice on Tuesday. Can you take a look?'] },
  {
    id: 'g2',
    from: 'agent',
    seen: true,
    lines: [
      'Checking now. I can see two authorisations against INV-4417, both for $248.00.',
      'The second one was a retry after the processor timed out, so only the first should have settled.'
    ]
  },
  { id: 'g3', from: 'you', lines: ['That matches the bank statement. Please refund the retry.'] },
  { id: 'g4', from: 'agent', lines: ['Refunded. It reaches your card in 3 to 5 business days.'], reactions: true }
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
          <AvatarImage src='/avatars/women/33.jpg' alt='Lena Ortiz' />
          <AvatarFallback>LO</AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-col gap-1'>
          <CardTitle>Lena Ortiz</CardTitle>
          <CardDescription>Billing support, replies in a few minutes</CardDescription>
        </div>
      </CardHeader>
      {/* align="end" resolves to align-self, so the turns must sit in a flex column. */}
      <CardContent className='flex flex-col gap-3'>
        {thread.map((group) => {
          const you = group.from === 'you';
          return (
            // align stays on each Bubble: the group stretches and has no side of its own.
            <BubbleGroup key={group.id} className={group.reactions ? 'mb-4' : group.seen ? 'mt-4' : undefined}>
              {/* Side and variant are visual only, so the group names its sender once. */}
              <span className='sr-only'>{you ? 'You said: ' : 'Lena said: '}</span>
              {group.lines.map((line, index) => (
                <Bubble key={line} align={you ? 'end' : 'start'} variant={you ? 'default' : 'muted'}>
                  <BubbleContent>{line}</BubbleContent>
                  {group.seen && index === 0 ? (
                    // A static row reads as one image with a spoken summary; side='top' anchors it above.
                    <BubbleReactions side='top' align='start' role='img' aria-label='Reactions: eyes and thumbs up'>
                      <span>👀</span>
                      <span>👍</span>
                    </BubbleReactions>
                  ) : null}
                  {group.reactions && index === group.lines.length - 1 ? (
                    // The row collapses its own padding once it holds a button,
                    // so the single control is the hit area.
                    <BubbleReactions>
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
                    </BubbleReactions>
                  ) : null}
                </Bubble>
              ))}
            </BubbleGroup>
          );
        })}
        <p className='self-end text-xs text-ui-muted-foreground'>Delivered 9:41</p>
      </CardContent>
    </Card>
  );
}

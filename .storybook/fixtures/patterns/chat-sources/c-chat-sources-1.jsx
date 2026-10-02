'use client';
import { default as Avatar } from '../../../../src/components/core/Avatar/index.js';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/chat/MessageList/parts/message-parts.jsx';
import { MessageFeedback } from '../../../../src/components/chat/ChatFeedback/parts/message-feedback.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Sources are parts of the turn; the text cites them by position as [1], [2]…
const parts = [
  {
    type: 'reasoning',
    duration: 14,
    steps: [
      { status: 'done', text: 'Searched for studies on reading time and article length.' },
      { status: 'done', text: 'Dropped two vendor blogs that cite each other.' },
      { status: 'done', text: 'Compared the remaining three on sample size.' }
    ]
  },
  {
    type: 'text',
    text: `Long reads do keep readers longer, but only once they are past the first screen. Median engaged time rises with length up to roughly 2,000 words and then flattens [1]. Most of the drop-off happens in the first 15% of the page, so the opening matters more than the total length [2].

Two practical takeaways for the newsletter:

- Put the claim in the first paragraph and the evidence after it.
- Split anything past 3,000 words into a series; completion falls sharply beyond that [3].`
  },
  { type: 'source', title: 'How long do readers stay on long-form pages?', url: 'https://example.com/research/engaged-time', site: 'Reading Lab', excerpt: 'Engaged time grows with length up to about 2,000 words, then plateaus across 1.2M sessions.' },
  { type: 'source', title: 'Where readers leave an article', url: 'https://example.com/research/scroll-depth', site: 'Newsroom Metrics', excerpt: 'Over half of all exits happen within the first screen of text.' },
  { type: 'source', title: 'Series vs single posts.pdf', kind: 'document', excerpt: 'Internal study: completion rates for posts over 3,000 words, 2025.' }
];

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
      <Message align='end'>
        <MessageAvatar>
          <Avatar src='https://randomuser.me/api/portraits/men/32.jpg' name='Daniel Okafor' size='sm' shape='circle' alt='' />
        </MessageAvatar>
        <MessageContent>
          <span className='sr-only'>Daniel Okafor said</span>
          <Bubble align='end'>
            <BubbleContent>Do long reads actually keep people around? I want sources before we change the newsletter.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar className='self-start'>
          <span className='bg-accent-subtle text-accent grid size-8 place-items-center rounded-full'>
            <RegistryIcon lucide='Sparkles' className='size-4' />
          </span>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <MessageParts parts={parts} sourcesLabel='3 sources' />
          <MessageFeedback copyText={parts[1].text} />
        </MessageContent>
      </Message>
    </div>
  );
}

'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { default as Avatar } from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';

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
      <ChatMessage align='end'>
        <ChatMessageAvatar>
          <Avatar src='/avatars/person-41.svg' name='Ansel Mwangi' size='sm' shape='circle' alt='' />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <span className='sr-only'>Ansel Mwangi said</span>
          <ChatBubble align='end'>
            <ChatBubbleContent>Do long reads actually keep people around? I want sources before we change the newsletter.</ChatBubbleContent>
          </ChatBubble>
        </ChatMessageContent>
      </ChatMessage>
      <ChatMessage>
        <ChatMessageAvatar className='self-start'>
          <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
          <ChatMessageParts parts={parts} sourcesLabel='3 sources' />
          <ChatMessageFeedback copyText={parts[1].text} />
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );
}

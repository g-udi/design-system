import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatMessageParts, ChatMessageScroller, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';

export const conversation = [
  { id: 'q1', role: 'user', text: 'Which posts kept readers longest last month?' },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      { type: 'reasoning', duration: 4, steps: [{ text: 'Read September reading-time data', status: 'done' }, { text: 'Rank posts by median time on page', status: 'done' }] },
      { type: 'tool', name: 'reading_stats', status: 'done', input: { month: '2026-09' }, output: { posts: 14, medianMinutes: 6.2 } },
      { type: 'text', text: 'Three posts held readers past **eight minutes** [1]:\n\n1. *Local-first drafts*: 11 min\n2. *Designing for real data*: 9 min\n3. *Small tools, long lifetimes*: 8 min\n\nAll three open with a working example before any theory.' },
      { type: 'source', title: 'Reading time report, September', url: 'https://example.com/reports/september', site: 'Analytics' }
    ]
  },
  { id: 'q2', role: 'user', text: 'Draft a teaser for the top one.' }
];

export function Conversation({ streaming, feedback }) {
  const lastAssistant = conversation.filter((turn) => turn.role === 'assistant').at(-1);
  return (
    <ChatMessageScrollerProvider>
      <ChatMessageScroller className='h-120 w-full max-w-2xl rounded-(--ds-radius-card) border'>
        <ChatMessageScrollerViewport>
          <ChatMessageScrollerContent className='p-4'>
            {conversation.map((turn) => (
              <ChatMessageScrollerItem key={turn.id} scrollAnchor={turn.role === 'user'}>
                {turn.role === 'user' ? (
                  <ChatMessage align='end'>
                    <ChatMessageContent>
                      <span className='sr-only'>You said</span>
                      <ChatBubble align='end'><ChatBubbleContent>{turn.text}</ChatBubbleContent></ChatBubble>
                    </ChatMessageContent>
                  </ChatMessage>
                ) : (
                  <ChatMessage>
                    <ChatAgentMark icon='Gaudi' tone='neutral' size='sm' decorative className='mt-0.5' />
                    <ChatMessageContent>
                      <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
                      <ChatMessageParts parts={turn.parts} streaming={streaming && turn === lastAssistant} />
                      {feedback && !(streaming && turn === lastAssistant) ? <ChatMessageFeedback copyText='Three posts held readers past eight minutes.' /> : null}
                    </ChatMessageContent>
                  </ChatMessage>
                )}
              </ChatMessageScrollerItem>
            ))}
          </ChatMessageScrollerContent>
        </ChatMessageScrollerViewport>
      </ChatMessageScroller>
    </ChatMessageScrollerProvider>
  );
}

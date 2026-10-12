import { useEffect, useState } from 'react';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { ChatSessionList } from '@gaudi/design-system/chat/ChatSessionList';
import { ChatPlan } from '@gaudi/design-system/chat/ChatPlanPanel';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';

export const sessions = [
  { id: 'post', title: 'Local-first drafts post', preview: 'Outline ready', group: 'Today', live: true },
  { id: 'rss', title: 'Fix the RSS feed dates', preview: 'Timezone was dropped', group: 'Yesterday' }
];

export const plan = [
  { id: 'outline', title: 'Outline the post', status: 'done' },
  { id: 'draft', title: 'Draft the opening', status: 'running' },
  { id: 'review', title: 'Ask Sarah to review', status: 'pending' }
];

export const reply = 'Here is the outline in four beats: the problem, the change, what readers notice and what it cost.';

export function ChatPlayground({ variant, title, navigation, details, welcome, streaming: requestedStreaming }) {
  const [streaming, setStreaming] = useState(requestedStreaming);
  useEffect(() => setStreaming(requestedStreaming), [requestedStreaming]);
  const [active, setActive] = useState('post');
  const [messages, setMessages] = useState({});
  const sent = messages[active] ?? [];
  const setSent = (update) => setMessages((current) => ({ ...current, [active]: typeof update === 'function' ? update(current[active] ?? []) : update }));
  const empty = welcome && !sent.length;
  return (
    <div className={variant === 'sidebar' ? 'h-130 w-full max-w-sm' : 'h-130 w-full'}>
      <ChatShell
        variant={variant}
        title={active === 'post' ? title : sessions.find((session) => session.id === active)?.title}
        navigation={navigation ? <ChatSessionList sessions={sessions} activeId={active} onSelect={setActive} searchable={false} /> : null}
        details={details ? <ChatPlan title='Plan' steps={plan} /> : null}
        composer={<ChatPromptComposer status={streaming ? 'streaming' : 'ready'} onStop={() => setStreaming(false)} onSubmit={(text) => setSent((list) => [...list, text])} labels={{ placeholder: 'Message Gaudi' }} />}
      >
        <div role='region' aria-label='Conversation' tabIndex={0} className='min-h-0 flex-1 overflow-y-auto p-4 focus-visible:outline-none'>
          {empty ? (
            <EmptyState title={<h2>What are we writing today?</h2>} description='Ask Gaudi to plan, edit or check a post.' actions={
              <ChatMessageParts parts={[{ type: 'suggestions', items: ['Plan next week', 'Edit my draft'] }]} onSuggestion={(text) => setSent([text])} />
            } />
          ) : (
            <div className='flex flex-col gap-4'>
              <ChatMessage align='end'>
                <ChatMessageContent>
                  <span className='sr-only'>You said</span>
                  <ChatBubble align='end'><ChatBubbleContent>{sent[0] || (active === 'post' ? 'Outline the local-first drafts post.' : 'Check the date format in the RSS feed.')}</ChatBubbleContent></ChatBubble>
                </ChatMessageContent>
              </ChatMessage>
              <ChatMessage>
                <ChatMessageContent>
                  <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
                  <ChatMessageParts parts={[{ type: 'text', text: streaming ? reply.slice(0, 48) : reply }]} streaming={streaming} />
                </ChatMessageContent>
              </ChatMessage>
              {sent.slice(1).map((text, index) => (
                <ChatMessage key={index} align='end'>
                  <ChatMessageContent>
                    <ChatBubble align='end'><ChatBubbleContent>{text}</ChatBubbleContent></ChatBubble>
                  </ChatMessageContent>
                </ChatMessage>
              ))}
            </div>
          )}
        </div>
      </ChatShell>
    </div>
  );
}

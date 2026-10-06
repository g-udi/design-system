'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { useState } from 'react';
import { default as Avatar } from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';

const failed = [
  { type: 'text', text: 'Comparing the two titles against last quarter’s' },
  { type: 'error', title: 'The reply stopped before it finished.', text: 'The connection dropped after 18 seconds. Nothing was saved.' }
];
const answered = [
  { type: 'text', text: '**“Small tools, long lifetimes”** is the stronger title. Shorter titles with a concrete noun had a 22% higher open rate this quarter.' },
  { type: 'suggestions', items: [
    { id: 'subtitle', label: 'Write a subtitle for it', icon: 'Pencil' },
    { id: 'variants', label: 'Give me three more variants', icon: 'Sparkles' },
    { id: 'test', label: 'Set up an A/B test', icon: 'Split' }
  ] }
];

function Person({ text }) {
  return (
    <ChatMessage align='end'>
      <ChatMessageAvatar>
        <Avatar src='/avatars/person-50.svg' name='Lee Park' size='sm' shape='circle' alt='' />
      </ChatMessageAvatar>
      <ChatMessageContent>
        <span className='sr-only'>Lee Park said</span>
        <ChatBubble align='end'>
          <ChatBubbleContent>{text}</ChatBubbleContent>
        </ChatBubble>
      </ChatMessageContent>
    </ChatMessage>
  );
}

export function Pattern() {
  const [state, setState] = useState('failed');
  const [follow, setFollow] = useState(null);
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
      <Person text='Which title will open better: “Small tools, long lifetimes” or “Tools that last”?' />
      <ChatMessage>
        <ChatMessageAvatar className='self-start'>
          <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
          <ChatMessageParts
            parts={state === 'failed' ? failed : answered}
            onRetry={() => setState('answered')}
            onSuggestion={(prompt) => setFollow(prompt)}
          />
        </ChatMessageContent>
      </ChatMessage>
      {follow ? <Person text={follow} /> : null}
    </div>
  );
}

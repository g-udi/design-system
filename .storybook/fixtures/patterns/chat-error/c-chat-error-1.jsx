'use client';
import { useState } from 'react';
import { default as Avatar } from '../../../../src/components/core/Avatar/index.js';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/chat/MessageList/parts/message-parts.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
    <Message align='end'>
      <MessageAvatar>
        <Avatar src='/avatars/men/75.jpg' name='Lee Park' size='sm' shape='circle' alt='' />
      </MessageAvatar>
      <MessageContent>
        <span className='sr-only'>Lee Park said</span>
        <Bubble align='end'>
          <BubbleContent>{text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}

export function Pattern() {
  const [state, setState] = useState('failed');
  const [follow, setFollow] = useState(null);
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
      <Person text='Which title will open better: “Small tools, long lifetimes” or “Tools that last”?' />
      <Message>
        <MessageAvatar className='self-start'>
          <span className='bg-accent-subtle text-accent grid size-8 place-items-center rounded-full'>
            <RegistryIcon lucide='Sparkles' className='size-4' />
          </span>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <MessageParts
            parts={state === 'failed' ? failed : answered}
            onRetry={() => setState('answered')}
            onSuggestion={(prompt) => setFollow(prompt)}
          />
        </MessageContent>
      </Message>
      {follow ? <Person text={follow} /> : null}
    </div>
  );
}

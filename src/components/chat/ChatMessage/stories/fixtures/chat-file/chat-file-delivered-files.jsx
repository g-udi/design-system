'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { useState } from 'react';
import { default as Avatar } from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageFeedback } from '@gaudi/design-system/chat/ChatFeedback';

const parts = [
  { type: 'text', text: 'Here is the September report. Subscribers grew **6.2%**, and the local-first post drove a third of new sign-ups.' },
  { type: 'data', label: 'September at a glance', value: { subscribers: 4980, growth: '6.2%', posts: 7, topPost: 'Notes on local-first software', averageReadTime: '5m 12s' } },
  { type: 'file', id: 'report', name: 'september-report.pdf', size: '412 KB', description: 'Four pages' },
  { type: 'file', id: 'csv', name: 'subscribers-2026-09.csv', size: '86 KB', description: '4,980 rows' }
];

export function Pattern() {
  const [action, setAction] = useState('');
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
      <ChatMessage align='end'>
        <ChatMessageAvatar>
          <Avatar src='/avatars/person-24.svg' name='Ilse Valtonen' size='sm' shape='circle' alt='' />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <span className='sr-only'>Ilse Valtonen said</span>
          <ChatBubble align='end'>
            <ChatBubbleContent>Send me the monthly report and the subscriber export.</ChatBubbleContent>
          </ChatBubble>
        </ChatMessageContent>
      </ChatMessage>
      <ChatMessage>
        <ChatMessageAvatar className='self-start'>
          <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative />
        </ChatMessageAvatar>
        <ChatMessageContent>
          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
          <ChatMessageParts parts={parts} onFileAction={(kind, file) => setAction(`${kind === 'preview' ? 'Opening' : 'Downloading'} ${file.name}`)} />
          <ChatMessageFeedback copyText={parts[0].text} />
          <p role='status' className='text-text-muted text-xs'>{action}</p>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );
}

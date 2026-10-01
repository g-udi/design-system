'use client';
import { useState } from 'react';
import { default as Avatar } from '../../../../src/components/core/Avatar/index.js';
import { Bubble, BubbleContent } from '../../../../src/components/core/Message/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/core/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/core/Message/parts/message-parts.jsx';
import { MessageFeedback } from '../../../../src/components/core/Message/parts/message-actions.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
      <Message align='end'>
        <MessageAvatar>
          <Avatar src='https://randomuser.me/api/portraits/women/68.jpg' name='Emma Wilson' size='sm' shape='circle' alt='' />
        </MessageAvatar>
        <MessageContent>
          <span className='sr-only'>Emma Wilson said</span>
          <Bubble align='end'>
            <BubbleContent>Send me the monthly report and the subscriber export.</BubbleContent>
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
          <MessageParts parts={parts} onFileAction={(kind, file) => setAction(`${kind === 'preview' ? 'Opening' : 'Downloading'} ${file.name}`)} />
          <MessageFeedback copyText={parts[0].text} />
          <p role='status' className='text-text-muted text-xs'>{action}</p>
        </MessageContent>
      </Message>
    </div>
  );
}

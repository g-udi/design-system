'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { useState } from 'react';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import { ChatActivity } from '@gaudi/design-system/chat/ChatActivityHistory';
import { ChatPlan } from '@gaudi/design-system/chat/ChatPlanPanel';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// The launch checklist the agent works through; each press of "Run next step" advances it.
const steps = [
  { id: 'copy', title: 'Proofread the announcement', tool: 'proofread', detail: '3 fixes, all accepted' },
  { id: 'images', title: 'Generate social images', tool: 'render_cards', detail: '4 sizes, alt text written' },
  { id: 'schedule', title: 'Schedule the newsletter', tool: 'schedule_newsletter', detail: 'Friday 08:00, 4,980 subscribers' },
  { id: 'notify', title: 'Tell the team', tool: 'post_message', detail: 'Posted in #launches' }
];

const statusAt = (index, progress) => (index < progress ? 'done' : index === progress ? 'running' : 'pending');

export function Pattern() {
  const [progress, setProgress] = useState(1);
  const finished = progress >= steps.length;
  const plan = steps.map((step, index) => ({ id: step.id, title: step.title, status: statusAt(index, progress), description: index < progress ? step.detail : undefined }));
  const activity = steps.slice(0, progress).map((step, index) => ({ id: step.id, time: `09:${String(12 + index * 3).padStart(2, '0')}`, title: step.title, detail: step.detail, status: 'done' }));
  const parts = [
    { type: 'text', text: 'Launching **Gaudi 2.0** today. I will work through the checklist and stop if anything needs a decision.' },
    ...steps.slice(0, Math.min(progress + 1, steps.length)).map((step, index) => ({ id: step.id, type: 'tool', name: step.tool, description: step.title, status: statusAt(index, progress), output: index < progress ? { result: step.detail } : undefined })),
    ...(finished ? [{ type: 'text', text: 'Everything is out. The newsletter goes on **Friday at 08:00**.' }] : [])
  ];
  return (
    <div className='grid h-150 w-full gap-3'>
      <ChatShell
        title='Launch: Gaudi 2.0'
        subtitle={finished ? 'All steps finished' : `Step ${progress + 1} of ${steps.length}`}
        details={
          <>
            <ChatPlan title='Launch checklist' steps={plan} />
            <ChatActivity items={activity} />
          </>
        }
        headerActions={
          <Button size='xs' onClick={() => setProgress((value) => (finished ? 0 : value + 1))}>
            <RegistryIcon lucide={finished ? 'RotateCcw' : 'ArrowRight'} />
            {finished ? 'Start over' : 'Run next step'}
          </Button>
        }
      >
        <div role='region' aria-label='Conversation' tabIndex={0} className='min-h-0 flex-1 overflow-y-auto p-4 focus-visible:outline-none'>
          <ChatMessage>
            <ChatMessageAvatar className='self-start'>
              <ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='md' decorative />
            </ChatMessageAvatar>
            <ChatMessageContent>
              <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
              <ChatMessageParts parts={parts} streaming={!finished} />
            </ChatMessageContent>
          </ChatMessage>
        </div>
      </ChatShell>
      <span role='status' className='sr-only'>{finished ? 'Launch checklist finished.' : `Running: ${steps[progress].title}`}</span>
    </div>
  );
}

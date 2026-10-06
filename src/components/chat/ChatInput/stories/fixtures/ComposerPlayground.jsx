import { useEffect, useRef, useState } from 'react';
import { ChatEffortSlider } from '@gaudi/design-system/chat/ChatEffortSlider';
import { ChatModelSelect, ChatPromptComposer, ChatPromptQueue } from '@gaudi/design-system/chat/ChatInput';
import { chatModels, chatModelProviders } from './chatModels.js';

export const mentions = [
  { id: 'sarah', name: 'Sabine Okafor', description: 'Editor' },
  { id: 'draft', name: 'local-first-drafts.mdx', description: 'Draft', icon: 'FileText' }
];

export const commands = [
  { id: 'summarize', name: 'summarize', description: 'Summarize the open draft' },
  { id: 'outline', name: 'outline', description: 'Turn notes into an outline' }
];

export function ComposerPlayground({ status: requestedStatus, placeholder, models: showModels }) {
  const [status, setStatus] = useState(requestedStatus);
  useEffect(() => setStatus(requestedStatus), [requestedStatus]);
  const [queue, setQueue] = useState([]);
  const nextQueueId = useRef(0);
  const [sent, setSent] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [effort, setEffort] = useState('medium');
  const submit = (text) => {
    if (status === 'streaming') {
      const id = String(++nextQueueId.current);
      setQueue((items) => [...items, { id, text }]);
      return { queued: true };
    }
    setSent(text);
  };
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      {queue.length ? (
        <ChatPromptQueue
          items={queue}
          onRemove={(id) => setQueue((items) => items.filter((item) => item.id !== id))}
          onEdit={(id, text) => setQueue((items) => items.map((item) => (item.id === id ? { ...item, text } : item)))}
        />
      ) : null}
      <ChatPromptComposer
        status={status}
        onStop={() => setStatus('ready')}
        onSubmit={submit}
        mentions={mentions}
        commands={commands}
        labels={{ placeholder }}
        toolbar={showModels ? (
          <ChatModelSelect searchable models={chatModels} providers={chatModelProviders} value={model} onValueChange={setModel}>
            <ChatEffortSlider value={effort} onValueChange={setEffort} compact />
          </ChatModelSelect>
        ) : null}
      />
      <p role='status' className='text-text-muted text-sm'>{sent ? `Sent: ${sent}` : ''}</p>
    </div>
  );
}

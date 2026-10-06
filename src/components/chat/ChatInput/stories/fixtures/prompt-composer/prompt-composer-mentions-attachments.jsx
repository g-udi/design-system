'use client';
import { useState } from 'react';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { Badge } from '@gaudi/design-system/core/Pill';

const portrait = (path) => `/avatars/${path}.svg`;
const mentions = [
  { id: 'sarah', name: 'Sabine Okafor', description: 'Editor', avatar: portrait('person-20') },
  { id: 'daniel', name: 'Ansel Mwangi', description: 'Engineering', avatar: portrait('person-41') },
  { id: 'emma', name: 'Ilse Valtonen', description: 'Growth', avatar: portrait('person-24') },
  { id: 'research', name: 'Research agent', description: 'Searches the archive and the web', icon: 'Bot' },
  { id: 'drafts', name: 'Drafts', description: 'Folder · 12 posts', icon: 'Folder' }
];
const commands = [
  { id: 'summarize', name: 'summarize', description: 'Summarise the open draft', icon: 'ListChecks' },
  { id: 'outline', name: 'outline', description: 'Turn notes into an outline', icon: 'ListTodo' },
  { id: 'translate', name: 'translate', description: 'Translate the selection', icon: 'Globe' },
  { id: 'proofread', name: 'proofread', description: 'Fix spelling and grammar', icon: 'Check' }
];
const formatSize = (bytes) => (bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`);

export function Pattern() {
  const [attachments, setAttachments] = useState([{ id: 'notes', name: 'interview-notes.md', size: '12 KB', type: 'text/markdown' }]);
  const [sent, setSent] = useState(null);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-4 pt-64'>
      <ChatPromptComposer
        mentions={mentions}
        commands={commands}
        attachments={attachments}
        onAttach={(files) => setAttachments((current) => [...current, ...files.map((file) => ({ id: `${file.name}-${file.size}`, name: file.name, size: formatSize(file.size), type: file.type }))])}
        onRemoveAttachment={(id) => setAttachments((current) => current.filter((file) => file.id !== id))}
        onSubmit={(text, details) => {
          setSent({ text, details });
          setAttachments([]);
        }}
        footer='Enter sends · Shift+Enter adds a line · @ mentions people, agents and folders · / runs a command'
      />
      {sent ? (
        <div role='status' className='bg-surface-muted grid gap-2 rounded-(--ds-radius-card) border p-3 text-sm'>
          <p className='font-medium'>Sent</p>
          <p className='break-words'>{sent.text || 'No text'}</p>
          <div className='flex flex-wrap gap-1.5'>
            {sent.details.command ? <Badge variant='discovery-light'>/{sent.details.command.name}</Badge> : null}
            {sent.details.mentions.map((item) => <Badge key={item.id} variant='info-light'>@{item.name}</Badge>)}
            {sent.details.attachments.map((file) => <Badge key={file.id} variant='outline'>{file.name}</Badge>)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

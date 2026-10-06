import { useState } from 'react';
import { ChatModelSelect, ChatPromptAttachMenu, ChatPromptComposer, ChatPromptToggle } from '@gaudi/design-system/chat/ChatInput';
import { chatModels, chatModelProviders } from './chatModels.js';

export function InteractiveToolsExample({ disabled = false, variant = 'card' }) {
  const [search, setSearch] = useState(false);
  const [think, setThink] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const [files, setFiles] = useState([]);
  const [sent, setSent] = useState('');
  const enabled = [search && 'Search', think && 'Think'].filter(Boolean);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <ChatPromptComposer
        variant={variant}
        disabled={disabled}
        labels={{ placeholder: search ? 'What would you like to look up?' : think ? 'What would you like to work through?' : 'Ask anything…' }}
        attachments={files}
        onRemoveAttachment={(id) => setFiles((items) => items.filter((file) => file.id !== id))}
        onSubmit={(text, { attachments }) => {
          setSent(`Sent locally: ${text || attachments.map((file) => file.name).join(', ')}${enabled.length ? ` · ${enabled.join(' + ')}` : ''}`);
          setFiles([]);
        }}
        leftControls={
          <>
            <ChatPromptAttachMenu disabled={disabled} onAttach={(picked) => setFiles((items) => [...items, ...picked.map((file, index) => ({ id: `${file.name}-${items.length + index}`, name: file.name, type: file.type }))])} />
            <ChatPromptToggle icon='Globe' label='Search' pressed={search} onPressedChange={setSearch} disabled={disabled} />
            <ChatPromptToggle icon='Brain' label='Think' pressed={think} onPressedChange={setThink} disabled={disabled} />
            <ChatModelSelect searchable models={chatModels} providers={chatModelProviders} value={model} onValueChange={setModel} disabled={disabled} />
          </>
        }
      />
      <p role='status' className='min-h-5 text-sm text-text-muted'>{sent || 'Demo only. Tool choices apply to your next message.'}</p>
    </div>
  );
}

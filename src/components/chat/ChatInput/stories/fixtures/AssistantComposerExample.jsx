import { useState } from 'react';
import { chatModels, chatModelProviders } from './chatModels.js';
import { demoContext } from './chatContext.js';
import { InputGroupButton } from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { GoogleDrive } from '@gaudi/design-system/icons/brands/googleDrive';
import { ChatContextMeter, ChatModelSelect, ChatPromptAttachMenu, ChatPromptComposer, ChatPromptSettings } from '@gaudi/design-system/chat/ChatInput';

export const assistantModels = chatModels.filter((model) => model.provider !== 'google');

export const promptOptions = [
  { value: 'web', label: 'Web search', description: 'Look up current sources before answering', icon: 'Globe' },
  { value: 'tools', label: 'Use connected tools', description: 'Drive, Calendar and the docs workspace', icon: 'Wrench' },
  { value: 'memory', label: 'Remember this chat', description: 'Keep preferences for later chats', icon: 'Bookmark' }
];

export const attachItems = [
  { value: 'file', label: 'Upload files', icon: 'Paperclip', accept: '' },
  { value: 'photo', label: 'Add photos', icon: 'Image', accept: 'image/*' },
  { value: 'drive', label: 'Add from Drive', icon: GoogleDrive, separator: true }
];

export function AssistantComposerExample({ attachmentSide = 'left', modelSide = 'left', settingsSide = 'left', contextSide = 'left', variant = 'card' }) {
  const [model, setModel] = useState('gpt-4o');
  const [effort, setEffort] = useState('medium');
  const [options, setOptions] = useState({ web: true });
  const [files, setFiles] = useState([]);
  const [usage, setUsage] = useState({ inputTokens: 61_200, cachedInputTokens: 38_400, outputTokens: 18_300, reasoningTokens: 6_200 });
  const [sent, setSent] = useState('');
  const current = assistantModels.find((item) => item.value === model);
  const controls = [
    { side: attachmentSide, element: <ChatPromptAttachMenu key='attach' items={attachItems} onAttach={(picked) => setFiles((items) => [...items, ...picked.map((file) => ({ id: `${file.name}-${file.size}`, name: file.name, type: file.type }))])} onSelect={(item) => setSent(`${item.label} is not connected in this example.`)} /> },
    { side: modelSide, element: <ChatModelSelect key='model' searchable models={assistantModels} providers={chatModelProviders} value={model} onValueChange={setModel} /> },
    { side: settingsSide, element: <ChatPromptSettings key='settings' options={promptOptions} values={options} onValuesChange={setOptions} effort={effort} onEffortChange={setEffort} description='Applies to the next message.' /> },
    { side: contextSide, element: <ChatContextMeter key='context' {...demoContext(usage, current)} /> }
  ];
  const controlsOn = (side) => controls.filter((control) => control.side === side).map((control) => control.element);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <ChatPromptComposer
        variant={variant}
        labels={{ placeholder: 'Ask anything...' }}
        attachments={files}
        onRemoveAttachment={(id) => setFiles((items) => items.filter((file) => file.id !== id))}
        onSubmit={(text) => {
          setSent(text);
          setFiles([]);
          // Each turn adds the prompt and the reply to the context, so the meter fills as the chat grows.
          setUsage((value) => ({ ...value, inputTokens: value.inputTokens + 9_800, outputTokens: value.outputTokens + 4_200 }));
        }}
        leftControls={controlsOn('left')}
        rightControls={controlsOn('right')}
        voice={({ insert, disabled }) => (
          // A plain microphone button; swap in a ChatSpeechInput, which receives the same insert helper.
          <InputGroupButton size='icon-sm' variant='ghost' aria-label='Dictate' disabled={disabled} onClick={() => insert('Summarize the review notes for Sarah')}>
            <RegistryIcon lucide='Mic' />
          </InputGroupButton>
        )}
      />
      <p role='status' className='text-text-muted text-sm'>{sent ? `Sent: ${sent}` : ''}</p>
    </div>
  );
}

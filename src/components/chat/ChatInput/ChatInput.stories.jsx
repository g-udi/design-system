import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatEffortSlider } from '../ChatEffortSlider/index.js';
import { ChatModelSelect, PromptComposer, PromptQueue } from './index.js';

const models = [
  { value: 'fast', label: 'Fast', description: 'Quick edits and short answers' },
  { value: 'balanced', label: 'Balanced', description: 'Most writing and research', badge: 'Default' },
  { value: 'deep', label: 'Deep', description: 'Long analysis; slower' }
];
const mentions = [
  { id: 'sarah', name: 'Sarah Chen', description: 'Editor' },
  { id: 'draft', name: 'local-first-drafts.mdx', description: 'Draft', icon: 'FileText' }
];
const commands = [
  { id: 'summarize', name: 'summarize', description: 'Summarize the open draft' },
  { id: 'outline', name: 'outline', description: 'Turn notes into an outline' }
];

function ComposerPlayground({ status, placeholder, models: showModels }) {
  const [queue, setQueue] = useState([]);
  const [sent, setSent] = useState('');
  const [model, setModel] = useState('balanced');
  const [effort, setEffort] = useState('medium');
  const submit = (text) => {
    if (status === 'streaming') {
      setQueue((items) => [...items, { id: String(items.length + 1), text }]);
      return { queued: true };
    }
    setSent(text);
  };
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      {queue.length ? (
        <PromptQueue
          items={queue}
          onRemove={(id) => setQueue((items) => items.filter((item) => item.id !== id))}
          onEdit={(id, text) => setQueue((items) => items.map((item) => (item.id === id ? { ...item, text } : item)))}
        />
      ) : null}
      <PromptComposer
        status={status}
        onStop={() => {}}
        onSubmit={submit}
        mentions={mentions}
        commands={commands}
        labels={{ placeholder }}
        toolbar={showModels ? (
          <ChatModelSelect models={models} value={model} onValueChange={setModel}>
            <ChatEffortSlider value={effort} onValueChange={setEffort} compact />
          </ChatModelSelect>
        ) : null}
      />
      <p role='status' className='text-text-muted text-sm'>{sent ? `Sent: ${sent}` : ''}</p>
    </div>
  );
}

export default {
  title: 'Chat/ChatInput',
  id: 'chat-chatinput',
  tags: ['autodocs'],
  ...chatMeta('ChatInput', { component: PromptComposer, controls: { status: ['ready', 'streaming'], placeholder: 'text', models: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { status: 'ready', placeholder: 'Message Gaudi, @ to mention, / for commands', models: true },
  parameters: {
    docs: {
      description: { story: 'The composer: Enter sends and Shift+Enter adds a line, `@` opens people and files, `/` opens commands at the start of the prompt. With `status` streaming, Stop appears and new messages wait in the PromptQueue. `models` adds the ChatModelSelect with an effort slider to the toolbar.' },
      source: {
        language: 'jsx',
        code: `import { ChatEffortSlider, ChatModelSelect, PromptComposer, PromptQueue } from '@gaudi/design-system/chat';

<PromptQueue items={queue} onEdit={edit} onRemove={remove} />
<PromptComposer
  status={status}
  onSubmit={send}
  onStop={stop}
  mentions={mentions}
  commands={commands}
  toolbar={
    <ChatModelSelect models={models} value={model} onValueChange={setModel}>
      <ChatEffortSlider value={effort} onValueChange={setEffort} compact />
    </ChatModelSelect>
  }
/>`
      }
    }
  },
  render: (args) => <ComposerPlayground {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Tighten the intro{Enter}');
    if (args.status === 'streaming') await waitFor(() => expect(canvas.getByText('Tighten the intro')).toBeVisible());
    else await waitFor(() => expect(canvas.getByText('Sent: Tighten the intro')).toBeVisible());
  }
};

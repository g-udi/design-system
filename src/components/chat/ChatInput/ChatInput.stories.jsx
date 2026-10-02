import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatEffortSlider } from '../ChatEffortSlider/index.js';
import { InputGroupButton } from '../../core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { GoogleDrive } from '../../../icons/brands/googleDrive.jsx';
import { ChatContextMeter, ChatModelSelect, PromptAttachMenu, PromptComposer, PromptQueue, PromptSettings, chatModels } from './index.js';

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

const assistantModels = chatModels.filter((model) => model.provider !== 'google');
const promptOptions = [
  { value: 'web', label: 'Web search', description: 'Look up current sources before answering', icon: 'Globe' },
  { value: 'tools', label: 'Use connected tools', description: 'Drive, Calendar and the docs workspace', icon: 'Wrench' },
  { value: 'memory', label: 'Remember this chat', description: 'Keep preferences for later chats', icon: 'Bookmark' }
];
const attachItems = [
  { value: 'file', label: 'Upload files', icon: 'Paperclip', accept: '' },
  { value: 'photo', label: 'Add photos', icon: 'Image', accept: 'image/*' },
  { value: 'drive', label: 'Add from Drive', icon: GoogleDrive, separator: true }
];

function AssistantComposerExample() {
  const [model, setModel] = useState('gpt-4o');
  const [effort, setEffort] = useState('medium');
  const [options, setOptions] = useState({ web: true });
  const [files, setFiles] = useState([]);
  const [usage, setUsage] = useState({ inputTokens: 61_200, cachedInputTokens: 38_400, outputTokens: 18_300, reasoningTokens: 6_200 });
  const [sent, setSent] = useState('');
  const current = assistantModels.find((item) => item.value === model);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <PromptComposer
        variant='card'
        labels={{ placeholder: 'Ask anything...' }}
        attachments={files}
        onRemoveAttachment={(id) => setFiles((items) => items.filter((file) => file.id !== id))}
        onSubmit={(text) => {
          setSent(text);
          setFiles([]);
          // Each turn adds the prompt and the reply to the context, so the meter fills as the chat grows.
          setUsage((value) => ({ ...value, inputTokens: value.inputTokens + 9_800, outputTokens: value.outputTokens + 4_200 }));
        }}
        toolbar={
          <>
            <PromptAttachMenu
              items={attachItems}
              onAttach={(picked) => setFiles((items) => [...items, ...picked.map((file) => ({ id: `${file.name}-${file.size}`, name: file.name, type: file.type }))])}
              onSelect={(item) => setSent(`${item.label} is not connected in this example.`)}
            />
            <ChatModelSelect searchable models={assistantModels} value={model} onValueChange={setModel} />
            <PromptSettings
              options={promptOptions}
              values={options}
              onValuesChange={setOptions}
              effort={effort}
              onEffortChange={setEffort}
              description='Applies to the next message.'
            />
            <ChatContextMeter usage={usage} model={current} />
          </>
        }
        voice={({ insert, disabled }) => (
          // A plain microphone button; swap in a SpeechInput, which receives the same insert helper.
          <InputGroupButton size='icon-sm' variant='ghost' aria-label='Dictate' disabled={disabled} onClick={() => insert('Summarize the review notes for Sarah')}>
            <RegistryIcon lucide='Mic' />
          </InputGroupButton>
        )}
      />
      <p role='status' className='text-text-muted text-sm'>{sent ? `Sent: ${sent}` : ''}</p>
    </div>
  );
}

export const AssistantComposer = {
  name: 'Assistant composer: models, options and context',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The card composer from an assistant home: a `+` menu for files and photos, a searchable model list grouped by provider (Claude and OpenAI from `chatModels`, with context window, speed, cost and capability badges), an options popover with effort and switches, and the context meter with its token and cost breakdown. The microphone holds the send slot while the prompt is empty and send returns once there is text. On phones the toolbar wraps and the meter keeps only its ring.'
      },
      source: {
        language: 'jsx',
        code: `import {
  ChatContextMeter,
  ChatModelSelect,
  PromptAttachMenu,
  PromptComposer,
  PromptSettings,
  chatModels
} from '@gaudi/design-system/chat';

const current = chatModels.find((item) => item.value === model);

<PromptComposer
  variant='card'
  labels={{ placeholder: 'Ask anything...' }}
  attachments={files}
  onSubmit={send}
  toolbar={
    <>
      <PromptAttachMenu onAttach={addFiles} />
      <ChatModelSelect searchable models={chatModels} value={model} onValueChange={setModel} />
      <PromptSettings
        options={[{ value: 'web', label: 'Web search', icon: 'Globe' }]}
        values={options}
        onValuesChange={setOptions}
        effort={effort}
        onEffortChange={setEffort}
      />
      <ChatContextMeter usage={usage} model={current} />
    </>
  }
  voice={({ insert }) => <SpeechInput onTranscript={insert} />}
/>`
      }
    }
  },
  render: () => <AssistantComposerExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });

    await step('Pick a Claude model from the searchable list', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Model: GPT-4o' }));
      const search = await page.findByRole('combobox', { name: 'Search models' });
      await waitFor(() => expect(search).toHaveFocus());
      await expect(page.getByText('Anthropic')).toBeVisible();
      await expect(page.getByRole('option', { name: /GPT-4o/ })).toHaveAttribute('aria-checked', 'true');
      await userEvent.type(search, 'haiku');
      await waitFor(() => expect(page.queryByRole('option', { name: /GPT-4o/ })).not.toBeInTheDocument());
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Model: Claude Haiku 4.5' })).toBeVisible());
      // The meter follows the new model's window: the same tokens fill more of Haiku's 200K.
      await expect(canvas.getByRole('button', { name: /^Context: 4[23](\.\d)?% used, 85\.7K of 200K tokens/ })).toBeVisible();
    });

    await step('Open the options and turn on tools', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Options, Web search on' }));
      const dialog = await page.findByRole('dialog', { name: 'Options' });
      await expect(within(dialog).getByRole('slider', { name: 'Effort' })).toBeVisible();
      await userEvent.click(within(dialog).getByRole('switch', { name: 'Use connected tools' }));
      await expect(within(dialog).getByRole('switch', { name: 'Use connected tools' })).toBeChecked();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Options, Web search, Use connected tools on' })).toHaveFocus());
    });

    await step('Open the context breakdown', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^Context:/ }));
      const breakdown = await page.findByRole('dialog', { name: 'Context window' });
      await expect(within(breakdown).getByText('Cached input')).toBeVisible();
      await expect(within(breakdown).getByText('Estimated cost')).toBeVisible();
      await userEvent.keyboard('{Escape}');
    });

    await step('The microphone becomes send once there is text', async () => {
      await expect(canvas.getByRole('button', { name: 'Dictate' })).toBeVisible();
      await expect(canvas.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument();
      await userEvent.type(prompt, 'Draft');
      await expect(canvas.queryByRole('button', { name: 'Dictate' })).not.toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Send' })).toBeEnabled();
      await userEvent.clear(prompt);
      await userEvent.click(canvas.getByRole('button', { name: 'Dictate' }));
      await expect(prompt).toHaveValue('Summarize the review notes for Sarah');
      await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
      await waitFor(() => expect(canvas.getByText('Sent: Summarize the review notes for Sarah')).toBeVisible());
      await expect(canvas.getByRole('button', { name: 'Dictate' })).toBeVisible();
    });
  }
};

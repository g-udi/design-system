import chatModelsSource from './fixtures/chatModels.js?raw';
import chatContextSource from './fixtures/chatContext.js?raw';
import { previewSource } from '../../../../docs/components/previewSource.js';
import { AssistantComposerExample } from './fixtures/AssistantComposerExample.jsx';
import AssistantComposerExampleSource from './fixtures/AssistantComposerExample.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { playgroundSource } from '../../../../docs/components/previewSource.js';
import { ComposerPlayground } from './fixtures/ComposerPlayground.jsx';
import ComposerPlaygroundSource from './fixtures/ComposerPlayground.jsx?raw';
import { InteractiveToolsExample } from './fixtures/InteractiveToolsExample.jsx';
import InteractiveToolsExampleSource from './fixtures/InteractiveToolsExample.jsx?raw';

import { useRef, useState } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../../core/Button/index.js';
import { chatMeta } from '../../stories/story-helpers.jsx';

import { InputGroupButton } from '../../../core/Input/InputGroup.jsx';

import { ChatContextMeter, ChatPromptAttachMenu, ChatPromptComposer, ChatPromptQueue, ChatPromptSettings } from '../index.js';

const modelExampleSource = (source, path) => [
  publicSource(chatModelsSource, new URL('./fixtures/chatModels.js', import.meta.url)),
  publicSource(source.replace(/^import .* from '\.\/chatModels\.js';\n/gm, ''), new URL(path, import.meta.url))
].join('\n\n');

export const QueueLifecycle = {
  name: 'Queue lifecycle and focus',
  parameters: { docs: { description: { story: 'The host can finish a queued request while its row is being edited. Surviving queue controls keep keyboard focus; an empty queue retains its status anchor so Tab continues to the composer. Stop returns focus to the prompt when the host accepts the transition to ready.' } } },
  render: function QueueLifecycleExample() {
    const initialQueue = [{ id: 'review', text: 'Review the opening' }, { id: 'shorten', text: 'Shorten the conclusion' }];
    const [status, setStatus] = useState('streaming');
    const [queue, setQueue] = useState(initialQueue);
    const nextQueuedId = useRef(0);
    return <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <div className='flex flex-wrap gap-2'>
        <Button variant='outline' size='sm' onClick={() => setQueue((items) => items.slice(1))}>Complete first queued request</Button>
        <Button variant='outline' size='sm' onClick={() => { setQueue(initialQueue); setStatus('streaming'); }}>Reset demo</Button>
      </div>
      <ChatPromptQueue items={queue} onEdit={(id, text) => setQueue((items) => items.map((item) => item.id === id ? { ...item, text } : item))} onRemove={(id) => setQueue((items) => items.filter((item) => item.id !== id))} onSendNow={(id) => setQueue((items) => items.filter((item) => item.id !== id))} />
      <ChatPromptComposer status={status} onStop={() => setStatus('ready')} onSubmit={(text, { queued }) => { if (queued) { const id = `queued-${++nextQueuedId.current}`; setQueue((items) => [...items, { id, text }]); } else setStatus('streaming'); }} />
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.click(canvas.getByRole('button', { name: 'Stop reply' }));
    await waitFor(() => expect(prompt).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Edit: Review the opening' }));
    await expect(canvas.getByRole('textbox', { name: 'Edit queued message 1' })).toHaveFocus();
    // Complete the host request without moving focus away from its editor first.
    fireEvent.click(canvas.getByRole('button', { name: 'Complete first queued request' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit: Shorten the conclusion' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove: Shorten the conclusion' }));
    await waitFor(() => expect(canvas.getByRole('status', { name: 'Queued' })).toHaveFocus());
    await userEvent.tab();
    await expect(prompt).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset demo' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send now: Review the opening' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit: Shorten the conclusion' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Send now: Shorten the conclusion' }));
    await waitFor(() => expect(canvas.getByRole('status', { name: 'Queued' })).toHaveFocus());
    await userEvent.tab();
    await expect(prompt).toHaveFocus();
  }
};

export default {
  title: 'Chat/ChatInput',
  id: 'chat-chatinput',
  tags: ['autodocs'],
  ...chatMeta('ChatInput', { component: ChatPromptComposer, controls: { status: ['ready', 'streaming'], placeholder: 'text', models: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { status: 'ready', placeholder: 'Message Gaudi, @ to mention, / for commands', models: true },
  parameters: {
    docs: {
      description: { story: 'The composer: Enter sends and Shift+Enter adds a line, `@` opens people and files, `/` opens commands at the start of the prompt. With `status` streaming, Stop appears and new messages wait in the ChatPromptQueue. `models` adds the ChatModelSelect with an effort slider to the toolbar.' },
      source: playgroundSource('ComposerPlayground', { imports: modelExampleSource(ComposerPlaygroundSource, './fixtures/ComposerPlayground.jsx') })
    }
  },
  render: (args) => <ComposerPlayground {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Tighten the intro{Enter}');
    if (args.status === 'streaming') await waitFor(() => expect(canvas.getByText('Tighten the intro')).toBeVisible());
    else await waitFor(() => expect(canvas.getByText('Sent: Tighten the intro')).toBeVisible());

    const body = within(canvasElement.ownerDocument.body);
    await userEvent.type(prompt, '@');
    const mentionsList = await body.findByRole('listbox', { name: 'Mentions' });
    await waitFor(() => {
      const bounds = mentionsList.getBoundingClientRect();
      const viewport = canvasElement.ownerDocument.defaultView;
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.bottom).toBeLessThanOrEqual(viewport.innerHeight);
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(viewport.innerWidth);
    });
    await expect(prompt).toHaveFocus();
    await expect(prompt).toHaveAttribute('aria-controls', mentionsList.id);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(prompt).toHaveValue('@local-first-drafts.mdx '));
    await expect(body.queryByRole('listbox', { name: 'Mentions' })).not.toBeInTheDocument();
    await expect(prompt).toHaveFocus();

    await userEvent.clear(prompt);
    await userEvent.type(prompt, '/');
    await waitFor(() => expect(body.getByRole('listbox', { name: 'Commands' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox', { name: 'Commands' })).not.toBeInTheDocument());
    await expect(prompt).toHaveValue('/');
    await expect(prompt).toHaveFocus();

    await userEvent.clear(prompt);
    await userEvent.type(prompt, '@');
    await userEvent.click(canvas.getByText(args.status === 'streaming' ? 'Tighten the intro' : 'Sent: Tighten the intro'));
    await waitFor(() => expect(body.queryByRole('listbox', { name: 'Mentions' })).not.toBeInTheDocument());
    await expect(prompt).toHaveValue('@');
    await userEvent.type(prompt, 's');
    await userEvent.click(await body.findByRole('option', { name: /Sabine Okafor/ }));
    await waitFor(() => expect(prompt).toHaveValue('@SabineOkafor '));
    await waitFor(() => expect(prompt).toHaveFocus());
    await userEvent.clear(prompt);

    if (args.status === 'streaming') {
      await userEvent.click(canvas.getByRole('button', { name: 'Stop reply' }));
      await waitFor(() => expect(prompt).toHaveFocus());
      await expect(canvas.queryByRole('button', { name: 'Stop reply' })).not.toBeInTheDocument();
    }
    if (args.models) {
      const page = within(canvasElement.ownerDocument.body);
      const trigger = canvas.getByRole('button', { name: /^Model:/ });
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const search = await page.findByRole('combobox', { name: 'Search models' });
      await waitFor(() => expect(search).toHaveFocus());
      await userEvent.type(search, 'Haiku');
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(trigger).toHaveAccessibleName('Model: Claude Haiku 4.5'));
      await waitFor(() => expect(trigger).toHaveFocus());
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(page.getByRole('combobox', { name: 'Search models' })).toHaveFocus());
      await userEvent.tab();
      const effort = page.getByRole('slider', { name: 'Effort' });
      await expect(effort).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(effort).toHaveAttribute('aria-valuetext', 'High effort');
      await expect(trigger).toHaveAccessibleName('Model: Claude Haiku 4.5');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(page.queryByRole('dialog', { name: 'Model' })).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
      await userEvent.keyboard('{Enter}');
      const badge = await page.findByText('Recommended', { selector: '[data-slot="badge"]' });
      await waitFor(() => expect(badge).toBeVisible());
      await expect(badge).toHaveAttribute('data-slot', 'badge');
    }
  }
};

export const ExpandingTools = {
  name: 'Expanding tools',
  args: { disabled: false, variant: 'card' },
  argTypes: { disabled: { control: 'boolean' }, variant: { control: 'select', options: ['default', 'card'] } },
  parameters: {
    controls: { include: ['disabled', 'variant'] },
    docs: {
      description: { story: 'Compact tool icons animate and show a tooltip on hover, then expand their labels on keyboard focus and selection. Selected tools keep their label and accent; the attachment + rotates while its menu is open. The card has a muted writing area and an inset toolbar. Inspired by [Skiper AI Input 001](https://skiper-ui.com/v1/skiper81), composed from Gaudi primitives. Selection stays local to this demo.' },
      source: playgroundSource('InteractiveToolsExample', { imports: modelExampleSource(InteractiveToolsExampleSource, './fixtures/InteractiveToolsExample.jsx') })
    }
  },
  render: (args) => <InteractiveToolsExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const search = canvas.getByRole('button', { name: 'Search', exact: true });
    const think = canvas.getByRole('button', { name: 'Think', exact: true });
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    if (args.disabled) {
      for (const control of [search, think, prompt, canvas.getByRole('button', { name: 'Add attachments' }), canvas.getByRole('button', { name: /^Model:/ })]) await expect(control).toBeDisabled();
      return;
    }
    const model = canvas.getByRole('button', { name: 'Model: GPT-4o' });
    await userEvent.click(model);
    const modelSearch = await page.findByRole('combobox', { name: 'Search models' });
    await userEvent.type(modelSearch, 'Haiku');
    await userEvent.click(await page.findByRole('option', { name: /Claude Haiku 4.5/ }));
    await waitFor(() => expect(model).toHaveAccessibleName('Model: Claude Haiku 4.5'));
    await waitFor(() => expect(model).toHaveFocus());
    await expect(search).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(search);
    await expect(search).toHaveAttribute('aria-pressed', 'true');
    await expect(prompt).toHaveAttribute('placeholder', 'What would you like to look up?');
    await userEvent.tab();
    await expect(think).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(think).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(prompt);
    await waitFor(() => {
      for (const tool of [search, think]) expect(tool.querySelector('[data-slot="prompt-toggle-label"]').getBoundingClientRect().width).toBeGreaterThan(1);
    });
    await userEvent.type(prompt, 'Compare the options{Enter}');
    await expect(canvas.getByText('Sent locally: Compare the options · Search + Think')).toBeVisible();
    await expect(prompt).toHaveValue('');
    await expect(search).toHaveAttribute('aria-pressed', 'true');
    const attach = canvas.getByRole('button', { name: 'Add attachments' });
    await userEvent.click(attach);
    await expect(await page.findByRole('menuitem', { name: 'Upload files' })).toBeVisible();
    await expect(attach).toHaveAttribute('data-state', 'open');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(attach).toHaveFocus());
    await userEvent.click(search);
    await userEvent.click(think);
    await expect(search).toHaveAttribute('aria-pressed', 'false');
    await expect(think).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(prompt);
    await waitFor(() => {
      for (const tool of [search, think]) {
        expect(tool.querySelector('[data-slot="prompt-toggle-label"]').getBoundingClientRect().width).toBeLessThan(1);
        expect(tool.getBoundingClientRect().height).toBeLessThanOrEqual(tool.querySelector('[data-slot="prompt-toggle-icon"]').getBoundingClientRect().height + 1);
      }
    });
  }
};

const assistantComposerSource = (args) => previewSource('AssistantComposerExample', args, { imports: [
  publicSource(chatModelsSource, new URL('./fixtures/chatModels.js', import.meta.url)),
  publicSource(chatContextSource, new URL('./fixtures/chatContext.js', import.meta.url)),
  publicSource(AssistantComposerExampleSource.replace(/^import .* from '\.\/(chatModels|chatContext)\.js';\n/gm, ''), new URL('./fixtures/AssistantComposerExample.jsx', import.meta.url))
].join('\n\n') });

export const AssistantComposer = {
  name: 'Assistant composer: models, options and context',
  args: { variant: 'card', attachmentSide: 'left', modelSide: 'left', settingsSide: 'left', contextSide: 'left' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'card'] },
    attachmentSide: { name: 'Attachments side', control: 'inline-radio', options: ['left', 'right'] },
    modelSide: { name: 'Model side', control: 'inline-radio', options: ['left', 'right'] },
    settingsSide: { name: 'Settings side', control: 'inline-radio', options: ['left', 'right'] },
    contextSide: { name: 'Context side', control: 'inline-radio', options: ['left', 'right'] }
  },
  parameters: {
    controls: { include: ['variant', 'attachmentSide', 'modelSide', 'settingsSide', 'contextSide'] },
    docs: {
      description: {
        story:
          'The card composer from an assistant home: a `+` menu for files and photos, a searchable model list grouped by provider (Claude and OpenAI from story fixture data, with context window, speed, cost and capability badges), an options popover with effort and switches, and the context meter with its token and cost breakdown. The microphone holds the send slot while the prompt is empty and send returns once there is text. Use the side controls to place each control independently in `leftControls` or `rightControls`. Both groups wrap on narrow screens; the send/stop/voice group stays together at the trailing edge.'
      },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => assistantComposerSource(args) }
    }
  },
  render: (args) => <AssistantComposerExample {...args} />,
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });

    await step('Each control renders once on the configured side', async () => {
      const controls = [
        ['Add attachments', args.attachmentSide],
        ['Model: GPT-4o', args.modelSide],
        ['Options, Web search on', args.settingsSide],
        [/^Context:/, args.contextSide]
      ];
      for (const [name, side] of controls) {
        const control = canvas.getByRole('button', { name });
        await expect(control.closest('[data-side]')).toHaveAttribute('data-side', side);
      }
    });

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
      const trigger = canvas.getByRole('button', { name: /^Context:/ });
      await userEvent.click(trigger);
      const breakdown = await page.findByRole('dialog', { name: 'Context window' });
      await waitFor(() => expect(within(breakdown).getByText('Cached input')).toBeVisible());
      await waitFor(() => expect(within(breakdown).getByText('Estimated cost')).toBeVisible());
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(page.queryByRole('dialog', { name: 'Context window' })).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
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

    await step('Model recommendations use the shared badge', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /^Model:/ }));
      const badge = await page.findByText('Recommended');
      await waitFor(() => expect(badge).toBeVisible());
      await expect(badge).toHaveAttribute('data-slot', 'badge');
    });
  }
};

export const SplitControls = {
  ...AssistantComposer,
  name: 'Split controls: model left, settings and context right',
  args: { ...AssistantComposer.args, settingsSide: 'right', contextSide: 'right' }
};

export const RightControls = {
  ...AssistantComposer,
  name: 'All controls on the right',
  args: { ...AssistantComposer.args, attachmentSide: 'right', modelSide: 'right', settingsSide: 'right', contextSide: 'right' }
};

export const HostEvents = {
  name: 'Host keyboard and input handlers',
  parameters: { docs: { description: { story: 'A host can reserve Enter with preventDefault while observing changes, selection and clicks. The send button still submits, and the host textarea ref shares the actual control.' } } },
  render: function HostEventsExample() {
    const textarea = useRef(null);
    const [changed, setChanged] = useState('');
    const [clicked, setClicked] = useState(false);
    const [selected, setSelected] = useState(false);
    const [sent, setSent] = useState('');
    return <div className='grid w-full max-w-xl gap-3'>
      <ChatPromptComposer defaultValue='Ready' onSubmit={setSent} textareaProps={{
        ref: textarea,
        onChange: (event) => setChanged(event.target.value),
        onClick: () => setClicked(true),
        onSelect: () => setSelected(true),
        onKeyDown: (event) => { if (event.key === 'Enter') event.preventDefault(); }
      }} />
      <output data-testid='host-events' className='text-xs text-text-muted'>{JSON.stringify({ changed, clicked, selected, sent })}</output>
      <InputGroupButton onClick={() => textarea.current?.focus()}>Focus message</InputGroupButton>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.click(input);
    await userEvent.type(input, ' updated');
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('Ready updated');
    await expect(canvas.getByTestId('host-events')).toHaveTextContent('"changed":"Ready updated","clicked":true,"selected":true,"sent":""');
    await userEvent.click(canvas.getByRole('button', { name: 'Send', exact: true }));
    await expect(canvas.getByTestId('host-events')).toHaveTextContent('"sent":"Ready updated"');
    await userEvent.click(canvas.getByRole('button', { name: 'Focus message' }));
    await expect(input).toHaveFocus();
  }
};

export const DisabledSettings = {
  name: 'Disabling open composer settings',
  parameters: { docs: { description: { story: 'The host locks settings after a selection. Open switches and effort controls immediately honor disabled, along with the attachment trigger.' } } },
  render: function DisabledSettingsExample() {
    const [disabled, setDisabled] = useState(false);
    return <div className='flex flex-wrap items-center gap-2'>
      <ChatPromptSettings disabled={disabled} defaultEffort='medium' options={[{ value: 'web', label: 'Web search' }, { value: 'tools', label: 'Use tools' }]} onValuesChange={() => setDisabled(true)} />
      <ChatPromptAttachMenu disabled={disabled} />
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Options' }));
    await userEvent.click(await body.findByRole('switch', { name: 'Web search' }));
    await expect(body.getByRole('switch', { name: 'Use tools' })).toBeDisabled();
    await expect(body.getByRole('slider', { name: 'Effort' })).toHaveAttribute('data-disabled');
    await expect(canvas.getByRole('button', { name: 'Add attachments' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
  }
};

export const PreparedContext = {
  name: 'Context with host-prepared values',
  parameters: { docs: { description: { story: 'The host supplies labels, formatted values, cost, tone and status. The meter only derives a percentage from the supplied total and limit.' } } },
  render: () => <ChatContextMeter
    usedTokens={0}
    maxTokens={100}
    tone='warning'
    message='This workspace is using a host-managed allowance.'
    formatTokens={(value) => `${value},0`}
    formatPercentage={(value) => `${value} percent`}
    breakdown={[{ id: 0, label: 'API_INPUT', value: '0,00', detail: 'included' }, { id: 'remaining', label: 'Remaining', value: 100 }]}
    cost={<span data-testid='prepared-context-cost'>0</span>}
    costLabel='Credits charged'
  />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Context: 0 percent used, 0,0 of 100,0 tokens' });
    await expect(trigger).toHaveAttribute('data-tone', 'warning');
    await userEvent.click(trigger);
    const panel = within(await body.findByRole('dialog', { name: 'Context window' }));
    await waitFor(() => expect(panel.getByText('API_INPUT')).toBeVisible());
    await expect(panel.getByText('0,00')).toBeVisible();
    await expect(panel.getByText('included')).toBeVisible();
    await expect(panel.getByTestId('prepared-context-cost')).toHaveTextContent('0');
    await expect(panel.getByText('Credits charged')).toBeVisible();
    await expect(panel.getByText('This workspace is using a host-managed allowance.')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  }
};

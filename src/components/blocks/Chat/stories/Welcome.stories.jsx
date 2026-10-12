import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../../core/Button/index.js';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../core/EmptyState/index.js';
import { ChatModelSelect, ChatPromptComposer } from '../../../chat/ChatInput/index.js';
import { chatModels, chatModelProviders } from '../../../chat/ChatInput/stories/fixtures/chatModels.js';
import { ChatPersona } from '../../../chat/ChatPersona/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

export default { title: 'Blocks/Chat', id: 'blocks-chat', tags: ['autodocs'], decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>] };

const starters = [
  { id: 'plan', label: 'Plan next week’s posts', icon: 'CalendarDays' },
  { id: 'edit', label: 'Edit my open draft', icon: 'Pencil' },
  { id: 'subtitle', label: 'Write a subtitle', prompt: 'Write a subtitle for my open draft.', icon: 'Type' },
  { id: 'check', label: 'Check the links', icon: 'Link' }
];

function WelcomeDemo({ title, description, showOrb, suggestions: showSuggestions, suggestionStyle }) {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const composer = useRef(null);
  const cards = suggestionStyle === 'cards';
  const choose = (item) => {
    setDraft(item.prompt || item.label);
    composer.current?.querySelector('[role="combobox"]')?.focus();
  };
  return (
    <Empty className='@container mx-auto max-w-3xl gap-6 py-8'>
      <EmptyHeader className='max-w-xl gap-3'>
        {showOrb ? <EmptyMedia><ChatPersona name='Gaudi' variant='iridescent' state='idle' size='md' decorative /></EmptyMedia> : null}
        <EmptyTitle><h2 className='text-xl font-semibold'>{title}</h2></EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='max-w-2xl gap-4'>
        <div ref={composer} className='w-full text-start'>
          <ChatPromptComposer
            variant='card'
            value={draft}
            onValueChange={setDraft}
            onSubmit={(text) => setSent(text)}
            labels={{ placeholder: 'Ask anything…' }}
            leftControls={<ChatModelSelect searchable models={chatModels} providers={chatModelProviders} value={model} onValueChange={setModel} />}
          />
        </div>
        {showSuggestions ? (
          <ul aria-label='Starter prompts' className={cn('min-w-0 gap-2', cards ? 'grid w-full grid-cols-1 @lg:grid-cols-2' : 'flex flex-wrap justify-center')}>
            {starters.map((item) => (
              <li key={item.id} className='min-w-0 max-w-full'>
                <Button variant='outline' size={cards ? 'md' : 'sm'} className={cn('h-auto max-w-full py-2 text-start whitespace-normal', cards && 'w-full justify-start')} onClick={() => choose(item)}>
                  <RegistryIcon lucide={item.icon} className='text-text-muted' />
                  <span className={cn('min-w-0 break-words', cards && 'flex-1')}>{item.label}</span>
                  {cards ? <RegistryIcon lucide='ArrowUpRight' className='ds-part-rtl-flip text-text-muted' /> : null}
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
        <p role='status' aria-label='Welcome submission' className='min-h-5 text-sm text-text-muted'>{sent ? `Sent: ${sent}` : ''}</p>
      </EmptyContent>
    </Empty>
  );
}

const welcomeSource = ({ showOrb = true, suggestions = true, suggestionStyle = 'cards', title, description }) => `import { useRef, useState } from 'react';
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@gaudi/design-system/core';
import { ChatModelSelect, ChatPersona, ChatPromptComposer } from '@gaudi/design-system/chat';

function Welcome({ starters, models, providers, model, onModelChange, send }) {
  const [draft, setDraft] = useState('');
  const composer = useRef(null);
  return (
    <Empty className='@container gap-6 py-8'>
      <EmptyHeader>${showOrb ? "\n        <EmptyMedia><ChatPersona name='Gaudi' state='idle' size='md' decorative /></EmptyMedia>" : ''}
        <EmptyTitle><h2>{${JSON.stringify(title)}}</h2></EmptyTitle>
        <EmptyDescription>{${JSON.stringify(description)}}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='max-w-2xl gap-4'>
        <div ref={composer} className='w-full text-start'>
          <ChatPromptComposer variant='card' value={draft} onValueChange={setDraft} onSubmit={send}
            leftControls={<ChatModelSelect searchable models={models} providers={providers} value={model} onValueChange={onModelChange} />}
          />
        </div>${suggestions ? `
        <ul aria-label='Starter prompts' className='${suggestionStyle === 'cards' ? 'grid w-full grid-cols-1 gap-2 @lg:grid-cols-2' : 'flex flex-wrap justify-center gap-2'}'>
          {starters.map((item) => (
            <li key={item.id} className='min-w-0'>
              <Button variant='outline' className='h-auto max-w-full whitespace-normal' onClick={() => {
                setDraft(item.prompt || item.label);
                composer.current?.querySelector('[role="combobox"]')?.focus();
              }}>{item.label}</Button>
            </li>
          ))}
        </ul>` : ''}
      </EmptyContent>
    </Empty>
  );
}`;

export const Welcome = {
  name: 'Welcome: orb, input and starter prompts',
  args: { title: 'What are we writing today?', description: 'Ask Gaudi to plan, draft, edit or check a post.', showOrb: true, suggestions: true, suggestionStyle: 'cards' },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    showOrb: { control: 'boolean' },
    suggestions: { control: 'boolean' },
    suggestionStyle: { control: 'inline-radio', options: ['cards', 'chips'] }
  },
  parameters: { controls: { include: ['title', 'description', 'showOrb', 'suggestions', 'suggestionStyle'] }, docs: {
    description: { story: 'The welcome surface composes Persona, Core EmptyState parts, ChatPromptComposer, ChatModelSelect and ordinary Core Buttons. Choosing a starter fills and focuses the input so it can be reviewed or edited before sending. The host supplies greeting copy, prompts and submission. The orb respects reduced motion. There is no separate welcome or suggestions component.' },
    source: { type: 'code', language: 'jsx', transform: (_source, { args }) => welcomeSource(args) }
  } },
  render: (args) => <WelcomeDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    if (args.suggestions) {
      await userEvent.click(canvas.getByRole('button', { name: 'Write a subtitle' }));
      await expect(prompt).toHaveValue('Write a subtitle for my open draft.');
      await expect(prompt).toHaveFocus();
      await userEvent.click(canvas.getByRole('button', { name: 'Edit my open draft' }));
      await expect(prompt).toHaveValue('Edit my open draft');
    } else await userEvent.type(prompt, 'Edit my open draft');
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(canvas.getByRole('status', { name: 'Welcome submission' })).toHaveTextContent('Sent: Edit my open draft'));
    await expect(prompt).toHaveValue('');
  }
};

export const CompactWelcome = {
  ...Welcome,
  name: 'Welcome: compact greeting and prompt chips',
  args: { ...Welcome.args, showOrb: false, suggestionStyle: 'chips' }
};

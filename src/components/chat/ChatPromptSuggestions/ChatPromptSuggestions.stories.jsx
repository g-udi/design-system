import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageSuggestions } from './index.js';

const suggestions = [
  { id: 'subtitle', label: 'Write a subtitle for it', icon: 'Pencil' },
  { id: 'tweet', label: 'Draft a post for social', icon: 'Send' },
  { id: 'check', label: 'Check the links', icon: 'Link' }
];

function Suggestions({ label, icons }) {
  const [picked, setPicked] = useState('');
  return (
    <div className='grid w-full max-w-xl gap-3'>
      <MessageSuggestions label={label} suggestions={icons ? suggestions : suggestions.map(({ id, label: text }) => ({ id, label: text }))} onSelect={setPicked} />
      <p role='status' className='text-text-muted text-sm'>{picked ? `Asked: ${picked}` : ''}</p>
    </div>
  );
}

export default {
  title: 'Chat/ChatPromptSuggestions',
  id: 'chat-chatpromptsuggestions',
  tags: ['autodocs'],
  ...chatMeta('ChatPromptSuggestions', { component: MessageSuggestions, controls: { label: 'text', icons: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { label: 'Suggested prompts', icons: true },
  parameters: {
    docs: {
      description: { story: 'Follow-up prompts as a labelled list of buttons. Suggestions are strings or `{ id, label, prompt?, icon? }`; `onSelect` receives the prompt text, usually to send it straight away.' },
      source: {
        language: 'jsx',
        code: `import { MessageSuggestions } from '@gaudi/design-system/chat';

<MessageSuggestions suggestions={['Write a subtitle for it', 'Draft a post for social']} onSelect={send} />`
      }
    }
  },
  render: (args) => <Suggestions {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: args.label })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Check the links' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Asked: Check the links'));
  }
};

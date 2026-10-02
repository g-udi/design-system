import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatWelcome } from './index.js';

const suggestions = [
  { id: 'plan', label: 'Plan next week’s posts', icon: 'CalendarDays' },
  { id: 'edit', label: 'Edit my open draft', icon: 'Pencil' },
  { id: 'stats', label: 'What did readers like in September?', icon: 'ChartBar' }
];

function Welcome({ title, description, icon }) {
  const [asked, setAsked] = useState('');
  return (
    <div className='grid w-full gap-2'>
      <ChatWelcome title={title} description={description} icon={icon} suggestions={suggestions} onSelect={setAsked} />
      <p role='status' className='text-text-muted text-center text-sm'>{asked ? `Starting: ${asked}` : ''}</p>
    </div>
  );
}

export default {
  title: 'Chat/ChatWelcome',
  id: 'chat-chatwelcome',
  tags: ['autodocs'],
  ...chatMeta('ChatWelcome', { component: ChatWelcome, controls: { title: 'text', description: 'text', icon: ['Sparkles', 'Pencil', 'Bot'] }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'What are we writing today?', description: 'Ask Gaudi to plan, draft, edit or check a post.', icon: 'Sparkles' },
  parameters: {
    docs: {
      description: { story: 'The empty state of a new chat: a greeting, one line on what the assistant can do, and prompts to start from. Picking a prompt usually sends it.' },
      source: {
        language: 'jsx',
        code: `import { ChatWelcome } from '@gaudi/design-system/chat';

<ChatWelcome title='What are we writing today?' description='Ask Gaudi to plan, draft, edit or check a post.' suggestions={starters} onSelect={send} />`
      }
    }
  },
  render: (args) => <Welcome {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Edit my open draft' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Starting: Edit my open draft'));
  }
};

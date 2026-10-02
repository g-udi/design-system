import { expect, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageData, MessageTool } from './index.js';

const output = { scheduled: '2026-10-06T09:00:00Z', audience: 4180, segment: 'Weekly digest' };

export default {
  title: 'Chat/ChatTool',
  id: 'chat-chattool',
  tags: ['autodocs'],
  ...chatMeta('ChatTool', { component: MessageTool, controls: { name: 'text', status: ['pending', 'running', 'done', 'failed', 'cancelled'], defaultOpen: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { name: 'schedule_newsletter', status: 'done', defaultOpen: true },
  parameters: {
    docs: {
      description: { story: 'One tool call. The header names the tool and its `status`; it opens to the input and output, shown with MessageData as a readable list with a JSON view. A failed call opens on its own with the error and a retry.' },
      source: {
        language: 'jsx',
        code: `import { MessageTool } from '@gaudi/design-system/chat';

<MessageTool
  name='schedule_newsletter'
  status={status}
  input={{ post: 'local-first-drafts', send: 'Monday 09:00' }}
  output={result}
  error={status === 'failed' ? 'The mailing service timed out.' : undefined}
  onRetry={retry}
/>`
      }
    }
  },
  render: ({ name, status, defaultOpen }) => (
    <div className='w-full max-w-xl'>
      <MessageTool
        key={`${status}-${defaultOpen}`}
        name={name}
        status={status}
        defaultOpen={defaultOpen}
        duration={status === 'done' ? 1.4 : undefined}
        input={{ post: 'local-first-drafts', send: 'Monday 09:00' }}
        output={status === 'done' ? output : undefined}
        error={status === 'failed' ? 'The mailing service timed out after 30 seconds.' : undefined}
        onRetry={status === 'failed' ? () => {} : undefined}
      />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const tool = canvasElement.querySelector('[data-slot="message-tool"]');
    await expect(tool).toHaveAttribute('data-status', args.status);
    await expect(within(canvasElement).getByText(args.name)).toBeVisible();
  }
};

export const StructuredData = {
  name: 'Structured data with a JSON view',
  parameters: { docs: { description: { story: 'MessageData on its own: values a tool returned, read as a list or table, with a JSON view for people who want the raw shape.' } } },
  render: () => (
    <div className='w-full max-w-xl'>
      <MessageData label='Newsletter performance' value={{ sent: 4180, opened: 2716, clicked: 612, unsubscribed: 9, topLink: '/posts/local-first-drafts' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Newsletter performance')).toBeVisible();
  }
};

import { expect, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatActivity } from '../index.js';

const items = [
  { id: '1', time: '09:12', title: 'Searched the archive for “sync”', detail: '14 posts matched', icon: 'Search' },
  { id: '2', time: '09:13', title: 'Handed research to the Research agent', status: 'done' },
  { id: '3', time: '09:15', title: 'Delivered september-reading-report.csv', icon: 'FileSpreadsheet' },
  { id: '4', time: '09:16', title: 'Scheduling the newsletter failed', detail: 'The mailing service timed out; retried at 09:17.', status: 'failed' },
  { id: '5', time: '09:17', title: 'Scheduled the newsletter for Monday 09:00', status: 'done' }
];

export default {
  title: 'Chat/ChatActivityHistory',
  id: 'chat-chatactivityhistory',
  tags: ['autodocs'],
  ...chatMeta('ChatActivityHistory', { component: ChatActivity, controls: { title: 'text', details: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Activity', details: true },
  parameters: {
    docs: {
      description: { story: 'What happened in the conversation, newest last: searches, handoffs, delivered files and failures. It is a history, not a progression, so every row sits on a neutral rail; an icon or a status marks each one.' },
      source: {
        language: 'jsx',
        code: `import { ChatActivity } from '@gaudi/design-system/chat';

<ChatActivity title='Activity' items={[
  { id: '1', time: '09:12', title: 'Searched the archive', icon: 'Search' },
  { id: '2', time: '09:17', title: 'Scheduled the newsletter', status: 'done' }
]} />`
      }
    }
  },
  render: ({ title, details }) => (
    <div className='w-full max-w-sm'>
      <ChatActivity title={title} items={details ? items : items.map(({ detail: _detail, ...item }) => item)} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: args.title })).toBeVisible();
    await expect(canvas.queryByText('14 posts matched') !== null).toBe(args.details);
  }
};

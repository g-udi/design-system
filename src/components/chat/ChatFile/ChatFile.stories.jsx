import { expect, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { MessageFile } from './index.js';

export default {
  title: 'Chat/ChatFile',
  id: 'chat-chatfile',
  tags: ['autodocs'],
  ...chatMeta('ChatFile', { component: MessageFile, controls: { name: 'text', size: 'text', description: 'text', preview: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { name: 'september-reading-report.csv', size: '18 KB', description: 'Reading time per post', preview: true },
  parameters: {
    docs: {
      description: { story: 'A file the assistant delivered. The icon follows the file type; preview and download are labelled with the file name, and `href` makes download a real link.' },
      source: {
        language: 'jsx',
        code: `import { MessageFile } from '@gaudi/design-system/chat';

<MessageFile name='september-reading-report.csv' size='18 KB' description='Reading time per post' href={url} onPreview={preview} />`
      }
    }
  },
  render: ({ preview, ...args }) => (
    <div className='w-full max-w-md'>
      <MessageFile {...args} href='#download' onPreview={preview ? () => {} : undefined} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: `Download ${args.name}` })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: `Preview ${args.name}` }) !== null).toBe(args.preview);
  }
};

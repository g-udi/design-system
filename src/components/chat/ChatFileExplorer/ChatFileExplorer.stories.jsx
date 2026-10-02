import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatFileExplorer } from './index.js';

const items = {
  root: { name: 'Files', children: ['drafts', 'data', 'notes'] },
  drafts: { name: 'drafts', children: ['post', 'teaser'] },
  post: { name: 'local-first-drafts.mdx', meta: 'Edited 10:40' },
  teaser: { name: 'newsletter-teaser.md', meta: '3 options' },
  data: { name: 'data', children: ['report'] },
  report: { name: 'september-reading-report.csv', meta: '18 KB' },
  notes: { name: 'reader-replies.txt', meta: '3 replies' }
};

function Files({ label, expanded }) {
  const [opened, setOpened] = useState('');
  return (
    <div className='grid w-full max-w-xs gap-3 rounded-(--ds-radius-card) border p-3'>
      <ChatFileExplorer key={`${expanded}`} items={items} label={label} defaultExpanded={expanded ? ['drafts', 'data'] : []} onSelect={(_id, file) => setOpened(file.name)} />
      <p role='status' className='text-text-muted text-xs'>{opened ? `Opened ${opened}` : ''}</p>
    </div>
  );
}

export default {
  title: 'Chat/ChatFileExplorer',
  id: 'chat-chatfileexplorer',
  tags: ['autodocs'],
  ...chatMeta('ChatFileExplorer', { component: ChatFileExplorer, controls: { label: 'text', expanded: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { label: 'Files', expanded: true },
  parameters: {
    docs: {
      description: { story: 'The files a conversation produced or uses, on the core Tree: arrow keys move and open folders, Enter opens a file through `onSelect`. Items are a flat map of `{ name, children?, meta? }` by id.' },
      source: {
        language: 'jsx',
        code: `import { ChatFileExplorer } from '@gaudi/design-system/chat';

<ChatFileExplorer items={files} defaultExpanded={['drafts']} onSelect={(id, file) => open(file)} />`
      }
    }
  },
  render: (args) => <Files {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tree', { name: args.label })).toBeVisible();
    if (args.expanded) {
      await userEvent.click(canvas.getByText('local-first-drafts.mdx'));
      await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Opened local-first-drafts.mdx'));
    }
  }
};

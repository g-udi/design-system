import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatSessionList } from './index.js';

const initial = [
  { id: 'post', title: 'Local-first drafts post', preview: 'Outline ready for review', updated: '10:42', group: 'Today', live: true },
  { id: 'rss', title: 'Fix the RSS feed dates', preview: 'Timezone was dropped', updated: '08:15', group: 'Today' },
  { id: 'teaser', title: 'Newsletter teaser', preview: 'Three subject lines', updated: 'Tue', group: 'This week' },
  { id: 'tags', title: 'Tag cleanup', preview: 'Merged 12 duplicate tags', updated: 'Sep 28', group: 'Older' }
];

function Sessions({ searchable }) {
  const [sessions, setSessions] = useState(initial);
  const [active, setActive] = useState('post');
  return (
    <div className='w-full max-w-xs rounded-(--ds-radius-card) border p-2'>
      <ChatSessionList
        sessions={sessions}
        activeId={active}
        searchable={searchable}
        onSelect={setActive}
        onNew={() => {
          const id = `new-${sessions.length}`;
          setSessions((list) => [{ id, title: 'New chat', group: 'Today' }, ...list]);
          setActive(id);
        }}
        onRename={(id, title) => setSessions((list) => list.map((session) => (session.id === id ? { ...session, title } : session)))}
        onDelete={(id) => setSessions((list) => list.filter((session) => session.id !== id))}
      />
    </div>
  );
}

export default {
  title: 'Chat/ChatSessionList',
  id: 'chat-chatsessionlist',
  tags: ['autodocs'],
  ...chatMeta('ChatSessionList', { component: ChatSessionList, controls: { searchable: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { searchable: true },
  parameters: {
    docs: {
      description: { story: 'Past conversations grouped by `group`, with search, a new-chat action, the current chat marked, and a menu per row to rename (in a dialog) or delete (after a confirmation). A live session shows that Gaudi is still replying.' },
      source: {
        language: 'jsx',
        code: `import { ChatSessionList } from '@gaudi/design-system/chat';

<ChatSessionList sessions={sessions} activeId={activeId} onSelect={setActiveId} onNew={startChat} onRename={rename} onDelete={remove} />`
      }
    }
  },
  render: (args) => <Sessions {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('[aria-current="page"]')).toHaveTextContent('Local-first drafts post');
    if (args.searchable) {
      await userEvent.type(canvas.getByRole('searchbox'), 'rss');
      await waitFor(() => expect(canvas.queryByText('Tag cleanup')).not.toBeInTheDocument());
    }
  }
};

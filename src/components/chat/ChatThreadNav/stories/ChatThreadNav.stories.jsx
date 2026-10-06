import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatThreadNav } from '../index.js';

const turns = [
  { id: 't1', label: 'Outline the local-first drafts post' },
  { id: 't2', label: 'Make the opening more concrete' },
  { id: 't3', label: 'Cut the history section' },
  { id: 't4', label: 'Write three subject lines' }
];

function Navigator({ start }) {
  const [current, setCurrent] = useState(start);
  const turn = turns.find((item) => item.id === current);
  return (
    <div className='flex w-full max-w-md items-center justify-between gap-3 rounded-(--ds-radius-card) border px-3 py-2 text-sm'>
      <span className='text-text-muted min-w-0 truncate' aria-live='polite'>{turn?.label}</span>
      <ChatThreadNav turns={turns} current={current} onNavigate={setCurrent} />
    </div>
  );
}

export default {
  title: 'Chat/ChatThreadNav',
  id: 'chat-chatthreadnav',
  tags: ['autodocs'],
  ...chatMeta('ChatThreadNav', { component: ChatThreadNav, controls: { start: turns.map((turn) => turn.id) }, primary: () => Playground })
};

export const Playground = {
  args: { start: 't2' },
  parameters: {
    docs: {
      description: { story: 'Steps through the prompts in a long thread: previous and next, and a menu of every prompt with the current one marked. `onNavigate(id)` should scroll the thread to that turn.' },
      source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatThreadNav } from '@gaudi/design-system/chat/ChatThreadNav';\nconst turns = [{ id: 'outline', label: 'Outline the post' }, { id: 'opening', label: 'Make the opening concrete' }];\nexport function ThreadNavigationExample() {\n  const [currentId, setCurrentId] = useState('outline');\n  const scrollToTurn = (id) => { setCurrentId(id); document.getElementById(id)?.scrollIntoView({ block: 'nearest' }); };\n  return <section aria-label='Conversation'><ChatThreadNav turns={turns} current={currentId} onNavigate={scrollToTurn} />{turns.map((turn) => <article key={turn.id} id={turn.id}><h2>{turn.label}</h2><p>Conversation content for this prompt.</p></article>)}</section>;\n}" }
    }
  },
  render: ({ start }) => <Navigator key={start} start={start} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const index = turns.findIndex((turn) => turn.id === args.start);
    await expect(canvas.getByRole('button', { name: new RegExp(`${index + 1} of ${turns.length}`) })).toBeVisible();
    if (index < turns.length - 1) {
      await userEvent.click(canvas.getByRole('button', { name: 'Next prompt' }));
      await waitFor(() => expect(canvas.getByText(turns[index + 1].label)).toBeVisible());
      await userEvent.click(canvas.getByRole('button', { name: 'Previous prompt' }));
      await waitFor(() => expect(canvas.getByText(turns[index].label)).toBeVisible());
    }
  }
};

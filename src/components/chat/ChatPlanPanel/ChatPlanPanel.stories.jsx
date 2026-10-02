import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { ChatPlan } from './index.js';

const steps = [
  { id: 'read', title: 'Read the draft and reader replies', status: 'done', owner: 'Gaudi' },
  { id: 'outline', title: 'Outline the rewrite', status: 'done', todos: [{ title: 'New opening', status: 'done' }, { title: 'Shorter history', status: 'done' }] },
  { id: 'draft', title: 'Draft the opening section', status: 'running', description: 'Leads with the train scene before the sync bug.' },
  { id: 'review', title: 'Ask Sarah to review', status: 'pending', owner: 'Sarah Chen' }
];

export default {
  title: 'Chat/ChatPlanPanel',
  id: 'chat-chatplanpanel',
  tags: ['autodocs'],
  ...chatMeta('ChatPlanPanel', { component: ChatPlan, controls: { title: 'text', defaultOpen: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Plan', defaultOpen: true },
  parameters: {
    docs: {
      description: { story: 'The agent’s plan for the current request. The header counts finished steps and shows progress; it collapses to that summary. Steps use the shared statuses and can carry an owner, a description and todos.' },
      source: {
        language: 'jsx',
        code: `import { ChatPlan } from '@gaudi/design-system/chat';

<ChatPlan title='Plan' steps={[
  { id: 'read', title: 'Read the draft', status: 'done' },
  { id: 'draft', title: 'Draft the opening', status: 'running' },
  { id: 'review', title: 'Ask Sarah to review', status: 'pending', owner: 'Sarah Chen' }
]} />`
      }
    }
  },
  render: ({ title, defaultOpen }) => (
    <div className='w-full max-w-sm'>
      <ChatPlan key={`${defaultOpen}`} title={title} steps={steps} defaultOpen={defaultOpen} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/2 of 4 done/)).toBeVisible();
  }
};

/** A plan that advances as the agent works. */
function LivePlan() {
  const [done, setDone] = useState(1);
  useEffect(() => {
    if (done >= steps.length) return undefined;
    const timer = setTimeout(() => setDone((count) => count + 1), 1200);
    return () => clearTimeout(timer);
  }, [done]);
  const live = steps.map((step, index) => ({ ...step, status: index < done ? 'done' : index === done ? 'running' : 'pending' }));
  return (
    <div className='grid w-full max-w-sm gap-3'>
      <ChatPlan title='Rewrite the opening' steps={live} />
      <button type='button' className='text-accent justify-self-start text-xs underline-offset-4 hover:underline' onClick={() => setDone(1)}>Start over</button>
    </div>
  );
}

export const PlanInProgress = {
  name: 'Plan in progress',
  parameters: { docs: { description: { story: 'Steps finish one after another; the count and the progress bar follow, and the running step shows a spinner.' } } },
  render: () => <LivePlan />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/4 of 4 done/)).toBeVisible(), { timeout: 6000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Start over' }));
    await waitFor(() => expect(canvas.getByText(/1 of 4 done/)).toBeVisible());
  }
};

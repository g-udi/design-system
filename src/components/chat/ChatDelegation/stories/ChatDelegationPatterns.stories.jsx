import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-delegation', import.meta.url,
  import.meta.glob('./fixtures/chat-delegation/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-delegation/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatDelegation', id: 'chat-chatdelegation', tags: ['autodocs'], ...catalogueMeta('chat-delegation') };

export const AgentHandoff = {
  name: 'Handing work to another agent',
  ...pattern('agent-handoff', 'A delegation card shows who took the work, the brief and its own tool calls; step through to see it finish.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Next step/ }));
    await userEvent.click(canvas.getByRole('button', { name: /Next step/ }));
    await waitFor(() => expect(canvas.getByText(/found/)).toBeVisible());
  }
};


export const HandoffRelay = {
  name: 'Agent handoff relay',
  ...pattern('handoff-relay', 'Follow a brief through Researcher, Writer and Reviewer. Inspect each transfer, restore missing context, recover a connection and finish the review.'),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Finish review' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Restore context' }));
    await expect(canvas.getByText('Restored to the review context')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Finish review' }));
    await expect(canvas.getByText('Ready for your review')).toBeVisible();
  }
};

export const AgentFleet = {
  name: 'Agent fleet',
  ...pattern('agent-fleet', 'Inspect lead agents and their nested teams, open task details, approve a request and recover a failed agent. Local demo actions update the fleet summary.'),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show Build lead' }));
    await expect(canvas.getByRole('tree', { name: 'Build lead agents' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show Build lead' }));
    await expect(canvas.getByText('Select a lead to inspect its delegated work.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Finish run' }));
    await expect(canvas.getByText('14 of 14 done')).toBeVisible();
  }
};


export const ConflictRadar = {
  name: 'Conflict radar',
  ...pattern('conflict-radar', 'Compare parallel file edits, choose an approach for overlapping changes, recover a disconnected agent and merge a local snapshot only when all conflicts are settled and agents have finished.'),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Security', exact: true }));
    await userEvent.click(canvas.getByRole('button', { name: 'mail.ts', exact: true }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Retries', exact: true }));
    await expect(canvas.getByRole('button', { name: 'Merge demo changes' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next update' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next update' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Merge demo changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Demo merged: six files with your two chosen approaches. No repository was changed.');
  }
};

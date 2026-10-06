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

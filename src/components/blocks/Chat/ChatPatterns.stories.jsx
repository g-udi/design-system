import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat',
  import.meta.glob('../../../../.storybook/fixtures/patterns/chat/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/chat/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Chat', id: 'blocks-chat', tags: ['autodocs'], ...catalogueMeta('chat') };

export const ChatPattern1 = {
  name: 'Full page: Reviewing a pull request',
  ...pattern(1, 'Sessions and the files the review touched on the left, the plan and activity on the right, tool runs and a diff in the thread, and a prompt navigator in the header. Below md the side columns open in Sheets.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Review: offline draft sync' })).toBeVisible();
    await waitFor(() => expect(canvas.getAllByRole('button', { name: /Next prompt/ })[0]).toBeVisible());
  }
};
export const ChatPattern2 = {
  name: 'Sidebar: Writing assistant beside the editor',
  ...pattern(2, 'A narrow assistant panel next to the draft: the reply streams, follow-ups queue while it works, and the chat history opens in a Sheet.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/never lose a paragraph/)).toBeVisible(), { timeout: 8000 });
  }
};
export const ChatPattern3 = {
  name: 'New chat: Welcome and suggestions',
  ...pattern(3, 'The empty state of a new chat; a suggestion or a typed prompt starts the conversation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Ideas for next week/ }));
    await waitFor(() => expect(canvas.getByText(/Three angles readers responded to/)).toBeVisible());
  }
};
export const ChatPattern4 = {
  name: 'Agent at work: Plan and activity',
  ...pattern(4, 'An agent works through a checklist: the plan marks each step, the activity log fills in, and the thread shows the tool calls.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Run next step/ }));
    await waitFor(() => expect(canvas.getAllByText('Generate social images').length).toBeGreaterThan(0));
  }
};

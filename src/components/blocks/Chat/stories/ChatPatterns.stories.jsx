import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat', import.meta.url,
  import.meta.glob('./fixtures/chat/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Chat', id: 'blocks-chat', tags: ['autodocs'], ...catalogueMeta('chat') };

export const PullRequestReview = {
  name: 'Full page: Reviewing a pull request',
  ...pattern('pull-request-review', 'Sessions and the files the review touched on the left, the plan and activity on the right, tool runs and a diff in the thread, and a prompt navigator in the header. Below md the side columns open in Sheets.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Review: offline draft sync' })).toBeVisible();
    await waitFor(() => expect(canvas.getAllByRole('button', { name: /Next prompt/ })[0]).toBeVisible());
    const body = within(canvasElement.ownerDocument.body);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Please check the conflict test{Enter}');
    await waitFor(() => expect(canvas.getByText('Please check the conflict test')).toBeVisible());
    const openSessions = async () => {
      const trigger = canvas.queryByRole('button', { name: 'Open chats' });
      if (!trigger) return canvas;
      await userEvent.click(trigger);
      const dialog = await body.findByRole('dialog', { name: 'Chats and files' });
      await expect(dialog).toBeVisible();
      return within(dialog);
    };
    const selectSession = async (name) => {
      const sessions = await openSessions();
      await userEvent.click(sessions.getByRole('button', { name, exact: true }));
      await waitFor(() => expect(body.queryByRole('dialog', { name: 'Chats and files' })).not.toBeInTheDocument());
    };
    await selectSession(/^Fix the RSS feed dates/);
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Fix the RSS feed dates' })).toBeVisible());
    await expect(canvas.queryByText('Please check the conflict test')).not.toBeInTheDocument();
    await selectSession(/^Review: offline draft sync/);
    await waitFor(() => expect(canvas.getByText('Please check the conflict test')).toBeVisible());
    await selectSession('New chat');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'New chat' })).toBeVisible());
    await expect(canvas.queryByText('Please check the conflict test')).not.toBeInTheDocument();
    await selectSession(/^Review: offline draft sync/);
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Review: offline draft sync' })).toBeVisible());
    await openSessions();
    const sessions = body.getByRole('navigation', { name: 'Chats', exact: true });
    const files = body.getByRole('region', { name: 'Files', exact: true });
    await waitFor(() => {
      const lastSession = within(sessions).getByRole('button', { name: /^Search ranking for old posts/ });
      expect(files.getBoundingClientRect().top).toBeGreaterThanOrEqual(lastSession.getBoundingClientRect().bottom);
      expect(sessions.scrollHeight).toBeLessThanOrEqual(sessions.clientHeight + 1);
    });
    if (body.queryByRole('dialog', { name: 'Chats and files' })) {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog', { name: 'Chats and files' })).not.toBeInTheDocument());
    }
  }
};
export const WritingAssistant = {
  name: 'Sidebar: Writing assistant beside the editor',
  ...pattern('writing-assistant', 'A narrow assistant panel next to the draft: the reply streams, follow-ups queue while it works, and the chat history opens in a Sheet.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/never lose a paragraph/)).toBeVisible(), { timeout: 8000 });
  }
};
export const WelcomeSuggestions = {
  name: 'New chat: Welcome and suggestions',
  ...pattern('welcome-suggestions', 'The empty state of a new chat; a suggestion or a typed prompt starts the conversation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Ideas for next week/ }));
    await waitFor(() => expect(canvas.getByText(/Three angles readers responded to/)).toBeVisible());
  }
};
export const AgentActivity = {
  name: 'Agent at work: Plan and activity',
  ...pattern('agent-activity', 'An agent works through a checklist: the plan marks each step, the activity log fills in, and the thread shows the tool calls.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Run next step/ }));
    await waitFor(() => expect(canvas.getAllByText('Generate social images').length).toBeGreaterThan(0));
  }
};

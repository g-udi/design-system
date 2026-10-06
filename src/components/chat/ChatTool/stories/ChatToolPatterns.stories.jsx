import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-tool', import.meta.url,
  import.meta.glob('./fixtures/chat-tool/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-tool/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatTool', id: 'chat-chattool', tags: ['autodocs'], ...catalogueMeta('chat-tool') };

export const RunningTools = {
  name: 'Running tools',
  ...pattern('running-tools', 'Tool calls with queued, running, done and failed states, nested calls, structured output as data or JSON, and a retry on the failed call.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const retry = await canvas.findByRole('button', { name: 'Retry' });
    await userEvent.click(retry);
    await waitFor(() => expect(canvas.getByText(/Scheduled for/)).toBeVisible(), { timeout: 4000 });
  }
};

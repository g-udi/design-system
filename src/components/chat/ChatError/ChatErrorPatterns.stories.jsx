import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-error',
  import.meta.glob('../../../../.storybook/fixtures/patterns/chat-error/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/chat-error/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatError', id: 'chat-chaterror', tags: ['autodocs'], ...catalogueMeta('chat-error') };

export const ChatErrorPattern1 = {
  name: 'Error, retry and suggestions',
  ...pattern(1, 'A failed turn explains what happened and retries; the answer ends with follow-up prompts.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Write a subtitle for it' }));
    await waitFor(() => expect(canvas.getAllByText('Write a subtitle for it').length).toBeGreaterThan(1));
  }
};

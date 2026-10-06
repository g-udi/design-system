import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'message', import.meta.url,
  import.meta.glob('./fixtures/message/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/message/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatMessage', id: 'chat-message', tags: ['autodocs'], ...catalogueMeta('message') };

export const TeamConversation = { name: 'Team conversation', ...pattern('team-conversation', 'align picks the side, avatars flip with the row and show presence, a ChatMessageGroup runs messages under one avatar, headers carry name and time, footers carry read and edited status, and files stack with the bubble.') };
export const AssistantReply = {
  name: 'Assistant reply',
  ...pattern('assistant-reply', 'An unframed reply moving from thinking, to typing, to settled, with copy, regenerate and rating controls in the footer.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Regenerate reply' }));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const pending = canvas.getByText('Reading the 14:00 to 14:10 trace...');
      // Activity belongs to the spinner; required status text stays legible.
      await expect(getComputedStyle(pending).opacity).toBe('1');
      await expect(getComputedStyle(pending).animationName).toBe('none');
      await expect(canvas.getByRole('button', { name: 'Copy reply' })).toBeDisabled();
    }
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Reply ready'), { timeout: 5000 });
    await expect(canvas.getByRole('button', { name: 'Copy reply' })).toBeEnabled();
  }
};

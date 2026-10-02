import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'message-scroller',
  import.meta.glob('../../../../.storybook/fixtures/patterns/message-scroller/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/message-scroller/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/MessageList', id: 'chat-messagelist', tags: ['autodocs'], ...catalogueMeta('message-scroller') };

export const MessageScrollerPattern4 = { name: 'Opening position and jump to latest', ...pattern(4, 'Compare start, end and last-anchor as the place a reopened thread opens at; the jump to latest control appears once the live edge is out of view.') };
export const MessageScrollerPattern2 = { name: 'Streaming reply that follows the edge', ...pattern(2, 'autoScroll pins the viewport while tokens arrive, and releases the moment the reader scrolls up.') };
export const MessageScrollerPattern3 = {
  name: 'Anchored turn with a previous peek',
  ...pattern(3, 'scrollAnchor lifts a sent message near the top while a slice of the previous turn stays visible.'),
  play: catalogueInteractions['message-scroller-3']
};
export const MessageScrollerPattern5 = { name: 'Load earlier without losing your place', ...pattern(5, 'Older turns prepend above the reader while the row they were reading stays put.') };
export const MessageScrollerPattern6 = { name: 'Thread navigator for stepping turns', ...pattern(6, 'A footer navigator that reports the turn you are reading and jumps between turns.') };
export const MessageScrollerPattern7 = {
  name: 'Streamed reply: drafting a post',
  ...pattern(7, 'A streamed markdown reply: the thinking trail folds away when the answer lands, the open code fence keeps streaming in CodeBlock, and the feedback bar appears once it finishes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible(), { timeout: 8000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Good reply' }));
    await expect(canvas.getByRole('button', { name: 'Good reply' })).toHaveAttribute('aria-pressed', 'true');
  }
};

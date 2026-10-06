import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'message-scroller', import.meta.url,
  import.meta.glob('./fixtures/message-scroller/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/message-scroller/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatMessageList', id: 'chat-messagelist', tags: ['autodocs'], ...catalogueMeta('message-scroller') };

export const JumpToLatest = { name: 'Opening position and jump to latest', ...pattern('jump-to-latest', 'Compare start, end and last-anchor as the place a reopened thread opens at; the jump to latest control appears once the live edge is out of view.') };
export const StreamingFollow = { name: 'Pinned to the newest streamed line', ...pattern('streaming-follow', 'autoScroll pins the viewport while tokens arrive, and releases the moment the reader scrolls up.') };
export const AnchoredTurn = {
  name: 'New turn anchored under the last answer',
  ...pattern('anchored-turn', 'scrollAnchor lifts a sent message near the top while a slice of the previous turn stays visible.'),
  play: catalogueInteractions['message-scroller-anchored-turn']
};
export const LoadEarlier = { name: 'Older history that keeps your position', ...pattern('load-earlier', 'Older turns prepend above the reader while the row they were reading stays put.') };
export const ThreadNavigator = { name: 'Step between turns from a navigator', ...pattern('thread-navigator', 'A footer navigator that reports the turn you are reading and jumps between turns.') };
export const DraftingPost = {
  name: 'Streamed reply: drafting a post',
  ...pattern('drafting-post', 'A streamed markdown reply: the thinking trail folds away when the answer lands, the open code fence keeps streaming in CodeBlock, and the feedback bar appears once it finishes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible(), { timeout: 8000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Good reply' }));
    await expect(canvas.getByRole('button', { name: 'Good reply' })).toHaveAttribute('aria-pressed', 'true');
  }
};

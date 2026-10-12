import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';
import { checkStreamingMotionPreference } from '../../../../../tests/components/chat/checkCompositionReuse.jsx';

const pattern = patternStories(
  'message-scroller', import.meta.url,
  import.meta.glob('./fixtures/message-scroller/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/message-scroller/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatMessageList', id: 'chat-messagelist', tags: ['autodocs'], ...catalogueMeta('message-scroller') };

async function scrollToStart(viewport) {
  viewport.focus();
  await userEvent.keyboard('{Home}');
  // Testing Library sends key events but cannot perform the browser's native scroll.
  // Keep the intent event (which releases stream following) and apply its scroll.
  viewport.scrollTop = 0;
  await waitFor(() => expect(viewport.scrollTop).toBeLessThanOrEqual(1));
}

export const JumpToLatest = {
  name: 'Opening position and jump to latest',
  ...pattern('jump-to-latest', 'Compare start, end and last-anchor as the place a reopened thread opens at; the jump to latest control appears once the live edge is out of view.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Saved analytics thread' });
    await userEvent.click(canvas.getByRole('radio', { name: 'start', exact: true }));
    await waitFor(() => expect(viewport.scrollTop).toBeLessThanOrEqual(1));
    const jump = canvas.getByRole('button', { name: 'Scroll to end' });
    await waitFor(() => expect(jump).toHaveAttribute('data-active', 'true'));
    await userEvent.click(jump);
    await waitFor(() => expect(viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop).toBeLessThanOrEqual(2));
    await expect(jump).toHaveAttribute('data-active', 'false');
    await userEvent.click(canvas.getByRole('radio', { name: 'last-anchor', exact: true }));
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'last-anchor', exact: true })).toHaveAttribute('aria-checked', 'true'));
    await expect(viewport.scrollTop).toBeGreaterThan(0);
  }
};
export const StreamingFollow = {
  name: 'Pinned to the newest streamed line',
  ...pattern('streaming-follow', 'autoScroll pins the viewport while tokens arrive, and releases the moment the reader scrolls up.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Live debugging thread' });
    const log = canvas.getByRole('log');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Reply complete'), { timeout: 8000 });
    await expect(log).toHaveAttribute('aria-busy', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay stream' }));
    await expect(log).toHaveAttribute('aria-busy', 'true');
    await scrollToStart(viewport);
    const length = log.textContent.length;
    await waitFor(() => expect(log.textContent.length).toBeGreaterThan(length));
    await expect(viewport.scrollTop).toBeLessThanOrEqual(1);
    const jump = canvas.getByRole('button', { name: 'Scroll to end' });
    await waitFor(() => expect(jump).toHaveAttribute('data-active', 'true'));
    await userEvent.click(jump);
    await waitFor(() => expect(viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop).toBeLessThanOrEqual(2));
  }
};
export const AnchoredTurn = {
  name: 'New turn anchored under the last answer',
  ...pattern('anchored-turn', 'scrollAnchor lifts a sent message near the top while a slice of the previous turn stays visible.'),
  play: catalogueInteractions['message-scroller-anchored-turn']
};
export const LoadEarlier = {
  name: 'Older history that keeps your position',
  ...pattern('load-earlier', 'Older turns prepend above the reader while the row they were reading stays put.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Author support thread' });
    await waitFor(() => expect(viewport).not.toHaveAttribute('data-pending-scroll'));
    await scrollToStart(viewport);
    const anchor = viewport.querySelector('[data-message-id]');
    const offset = anchor.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
    const load = canvas.getByRole('button', { name: 'Load earlier' });
    await userEvent.click(load);
    await expect(load).toBeDisabled();
    await waitFor(() => expect(canvas.getByText('11 of 16 messages')).toBeVisible(), { timeout: 2000 });
    await waitFor(() => expect(Math.abs(anchor.getBoundingClientRect().top - viewport.getBoundingClientRect().top - offset)).toBeLessThanOrEqual(2));
    await expect(load).toBeEnabled();
    await userEvent.click(load);
    await waitFor(() => expect(canvas.getByText('16 of 16 messages')).toBeVisible(), { timeout: 2000 });
    await expect(canvas.getByRole('button', { name: 'All loaded' })).toBeDisabled();
  }
};
export const ThreadNavigator = {
  name: 'Step between turns from a navigator',
  ...pattern('thread-navigator', 'A footer navigator that reports the turn you are reading and jumps between turns.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Retrospective thread' });
    await waitFor(() => expect(viewport).not.toHaveAttribute('data-pending-scroll'));
    await scrollToStart(viewport);
    await waitFor(() => expect(canvas.getByText('Turn 1 of 5')).toBeVisible());
    const previous = canvas.getByRole('button', { name: 'Previous turn' });
    const next = canvas.getByRole('button', { name: 'Next turn' });
    await expect(previous).toBeDisabled();
    for (let turn = 2; turn <= 5; turn += 1) {
      await userEvent.click(next);
      await waitFor(() => expect(canvas.getByText(`Turn ${turn} of 5`)).toBeVisible());
    }
    await expect(next).toBeDisabled();
    await userEvent.click(previous);
    await waitFor(() => expect(canvas.getByText('Turn 4 of 5')).toBeVisible());
    await expect(next).toBeEnabled();
  }
};
export const DraftingPost = {
  name: 'Streamed reply: drafting a post',
  ...pattern('drafting-post', 'A streamed markdown reply: the thinking trail folds away when the answer lands, the open code fence keeps streaming in CodeBlock, and the feedback bar appears once it finishes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible(), { timeout: 8000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Good reply' }));
    await expect(canvas.getByRole('button', { name: 'Good reply' })).toHaveAttribute('aria-pressed', 'true');
    await checkStreamingMotionPreference(canvasElement);
  }
};

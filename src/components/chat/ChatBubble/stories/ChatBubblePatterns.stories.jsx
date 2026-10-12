
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-bubble', import.meta.url,
  import.meta.glob('./fixtures/chat-bubble/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-bubble/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatBubble', id: 'chat-bubble', tags: ['autodocs'], ...catalogueMeta('chat-bubble') };

export const SupportThread = {
  name: 'Support thread',
  ...pattern('support-thread', 'align and variant carry the sender, consecutive turns share a ChatBubbleGroup, and reactions sit above or below a bubble, static or pressable.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const reaction = canvas.getByRole('button', { name: 'React with thanks, 1 so far' });
    await expect(reaction).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(reaction);
    await expect(reaction).toHaveAttribute('aria-label', 'React with thanks, 2 so far');
    await expect(reaction).toHaveAttribute('aria-pressed', 'true');
    await expect(reaction).toHaveTextContent('2');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--reaction-selected` });
    }
    await userEvent.keyboard('{Enter}');
    await expect(reaction).toHaveAttribute('aria-label', 'React with thanks, 1 so far');
    await expect(reaction).toHaveAttribute('aria-pressed', 'false');
    await expect(reaction).toHaveTextContent('1');
    await expect(reaction).toHaveFocus();
    await expect(canvas.getByRole('img', { name: 'Reactions: eyes and thumbs up' })).toBeVisible();
    await expect(canvas.getAllByText('Saskia said:', { exact: false })).toHaveLength(2);
  }
};
export const ReleaseThread = { name: 'Bubble styles across a deploy thread', ...pattern('release-thread', 'All seven variants doing the job each one is for, in one deploy thread.') };
export const ShowMore = {
  name: 'Formatted answer with show more',
  ...pattern('show-more', 'A ghost bubble with a heading, a list, emphasis and inline code, whose long tail folds behind a Collapsible.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show more' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('heading', { name: 'Why the webhooks dropped' })).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Show less' }));
    await waitFor(() => expect(canvas.queryByRole('heading', { name: 'Why the webhooks dropped' })).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
export const QuickReplies = {
  name: 'Suggested replies under a question',
  ...pattern('quick-replies', 'Tinted bubbles that are real buttons and a link, plus an action row after the pick.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Open the bounced delivery log' })).toHaveAttribute('href', '#');
    const choice = canvas.getByRole('button', { name: 'Hold them until I fix the links' });
    choice.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Held. Neither issue goes out until you confirm the links.', { exact: false })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Resend both issues now' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Check links' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Notify the owner' })).toBeVisible();
  }
};

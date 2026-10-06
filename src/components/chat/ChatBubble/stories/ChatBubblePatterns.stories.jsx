
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-bubble', import.meta.url,
  import.meta.glob('./fixtures/chat-bubble/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-bubble/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatBubble', id: 'chat-bubble', tags: ['autodocs'], ...catalogueMeta('chat-bubble') };

export const SupportThread = { name: 'Support thread', ...pattern('support-thread', 'align and variant carry the sender, consecutive turns share a ChatBubbleGroup, and reactions sit above or below a bubble, static or pressable.') };
export const ReleaseThread = { name: 'Bubble styles across a deploy thread', ...pattern('release-thread', 'All seven variants doing the job each one is for, in one deploy thread.') };
export const ShowMore = { name: 'Formatted answer with show more', ...pattern('show-more', 'A ghost bubble with a heading, a list, emphasis and inline code, whose long tail folds behind a Collapsible.') };
export const QuickReplies = { name: 'Suggested replies under a question', ...pattern('quick-replies', 'Tinted bubbles that are real buttons and a link, plus an action row after the pick.') };

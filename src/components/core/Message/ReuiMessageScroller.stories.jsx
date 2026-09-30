// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'message-scroller',
  import.meta.glob('../../../../.storybook/fixtures/reui/message-scroller/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/message-scroller/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Message', tags: ['autodocs'], ...catalogueMeta('message-scroller') };

export const ReuiMessageScroller1 = { name: 'Message Scroller: Chat transcript with jump to latest', ...pattern(1, 'A scroll region that opens at the live edge with a jump to latest control.') };
export const ReuiMessageScroller2 = { name: 'Message Scroller: Streaming reply that follows the edge', ...pattern(2, 'autoScroll pins the viewport while tokens arrive, and releases the moment the reader scrolls up.') };
export const ReuiMessageScroller3 = {
  name: 'Message Scroller: Anchored turn with a previous peek',
  ...pattern(3, 'scrollAnchor lifts a sent message near the top while a slice of the previous turn stays visible.'),
  play: catalogueInteractions['message-scroller-3']
};
export const ReuiMessageScroller4 = { name: 'Message Scroller: Opening position for a saved thread', ...pattern(4, 'Compare start, end and last-anchor as the place a reopened thread opens at.') };
export const ReuiMessageScroller5 = { name: 'Message Scroller: Load earlier without losing your place', ...pattern(5, 'Older turns prepend above the reader while the row they were reading stays put.') };
export const ReuiMessageScroller6 = { name: 'Message Scroller: Thread navigator for stepping turns', ...pattern(6, 'A footer navigator that reports the turn you are reading and jumps between turns.') };

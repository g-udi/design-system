// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'bubble',
  import.meta.glob('../../../../.storybook/fixtures/reui/bubble/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/bubble/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Message', tags: ['autodocs'], ...catalogueMeta('bubble') };

export const ReuiBubble1 = { name: 'Bubble: Support thread with sender alignment', ...pattern(1, 'A two sided billing thread where align and variant carry the sender.') };
export const ReuiBubble2 = { name: 'Bubble: Bubble variants in a release thread', ...pattern(2, 'All seven variants doing the job each one is for, in one deploy thread.') };
export const ReuiBubble3 = { name: 'Bubble: Grouped consecutive messages', ...pattern(3, 'Consecutive turns from one sender collapse into a single BubbleGroup.') };
export const ReuiBubble4 = { name: 'Bubble: Message reactions and a reaction button', ...pattern(4, 'A static emoji row, a pressable reaction with a count, and a top anchored row.') };
export const ReuiBubble5 = { name: 'Bubble: Long reply with show more', ...pattern(5, 'A long assistant answer folds to its first paragraph behind a Collapsible.') };
export const ReuiBubble6 = { name: 'Bubble: Quick reply bubbles and an action row', ...pattern(6, 'Tinted bubbles that are real buttons and a link, plus an action row after the pick.') };
export const ReuiBubble7 = { name: 'Bubble: Assistant answer with formatted content', ...pattern(7, 'A ghost bubble carrying a heading, a list, emphasis and inline code.') };

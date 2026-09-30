import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'bubble',
  import.meta.glob('../../../../.storybook/fixtures/patterns/bubble/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/bubble/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Messaging/Message', id: 'core-message', tags: ['autodocs'], ...catalogueMeta('bubble') };

export const BubblePattern1 = { name: 'Bubble: Support thread', ...pattern(1, 'align and variant carry the sender, consecutive turns share a BubbleGroup, and reactions sit above or below a bubble, static or pressable.') };
export const BubblePattern2 = { name: 'Bubble: Bubble variants in a release thread', ...pattern(2, 'All seven variants doing the job each one is for, in one deploy thread.') };
export const BubblePattern7 = { name: 'Bubble: Formatted answer with show more', ...pattern(7, 'A ghost bubble with a heading, a list, emphasis and inline code, whose long tail folds behind a Collapsible.') };
export const BubblePattern6 = { name: 'Bubble: Quick reply bubbles and an action row', ...pattern(6, 'Tinted bubbles that are real buttons and a link, plus an action row after the pick.') };

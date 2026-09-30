import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scroll-area',
  import.meta.glob('../../../../.storybook/fixtures/patterns/scroll-area/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/scroll-area/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ScrollArea', tags: ['autodocs'], ...catalogueMeta('scroll-area') };

export const ScrollAreaPattern1 = { name: 'Vertical list', ...pattern(1) };
export const ScrollAreaPattern2 = { name: 'Horizontal gallery', ...pattern(2, 'Add a horizontal `ScrollBar` for content wider than the frame.') };
export const ScrollAreaPattern3 = { name: 'Wide table', ...pattern(3, 'A table that overflows both axes keeps its scrollbars inside the frame.') };
export const ScrollAreaPattern4 = { name: 'Edge fade', ...pattern(4, 'Masks fade the edges that still have content to scroll to.') };
export const ScrollAreaPattern5 = { name: 'Scrollbar gutter', ...pattern(5, 'Padding appears only on an axis that overflows, so the scrollbar never covers content.') };

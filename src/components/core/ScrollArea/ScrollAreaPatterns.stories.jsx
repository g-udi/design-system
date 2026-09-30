import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scroll-area',
  import.meta.glob('../../../../.storybook/fixtures/patterns/scroll-area/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/scroll-area/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/ScrollArea', id: 'core-scrollarea', tags: ['autodocs'], ...catalogueMeta('scroll-area') };

export const ScrollAreaPattern2 = { name: 'Horizontal gallery', ...pattern(2, 'A horizontal `ScrollBar` for a strip wider than the frame. Masks fade the edges that still have content, and gutter padding appears only on an axis that overflows.') };
export const ScrollAreaPattern3 = { name: 'Wide table', ...pattern(3, 'A table that overflows both axes keeps its scrollbars inside the frame.') };

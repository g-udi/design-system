import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'pagination',
  import.meta.glob('../../../../.storybook/fixtures/patterns/pagination/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/pagination/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pagination', tags: ['autodocs'], ...catalogueMeta('pagination') };

export const PaginationPattern1 = { name: 'Numbered page styles', ...pattern(1, 'Text and icon arrows, circle, hover-border, joined and filled pages, each with an ellipsis before the last page.') };
export const PaginationPattern8 = { name: 'Previous and next with page info', ...pattern(8, 'Compact pagers for small screens: page info centred or leading, or arrows alone.') };
export const PaginationPattern12 = { name: 'Rows per page and range', ...pattern(12, 'A table footer with a page-size select, the visible range and first, previous, next and last.') };
export const PaginationPattern14 = { name: 'Jump to a page', ...pattern(14, 'Long result sets: a go-to-page input beside numbered pages, or a page select between first and last.') };

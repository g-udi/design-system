import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'pagination', import.meta.url,
  import.meta.glob('./fixtures/pagination/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/pagination/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Pagination', id: 'core-pagination', tags: ['autodocs'], ...catalogueMeta('pagination') };

export const Numbered = { name: 'Numbered page styles', ...pattern('numbered', 'Text and icon arrows, circle, hover-border, joined and filled pages, each with an ellipsis before the last page.') };
export const PreviousNext = { name: 'Previous and next with page info', ...pattern('previous-next', 'Compact pagers for small screens: page info centred or leading, or arrows alone.') };
export const RowsPerPage = { name: 'Rows per page and range', ...pattern('rows-per-page', 'A table footer with a page-size select, the visible range and first, previous, next and last.') };
export const JumpToPage = { name: 'Jump to a page', ...pattern('jump-to-page', 'Long result sets: a go-to-page input beside numbered pages, or a page select between first and last.') };

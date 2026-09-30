import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'pagination',
  import.meta.glob('../../../../.storybook/fixtures/patterns/pagination/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/pagination/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pagination', tags: ['autodocs'], ...catalogueMeta('pagination') };

export const PaginationPattern1 = { name: 'Basic', ...pattern(1) };
export const PaginationPattern2 = { name: 'Icon-only arrows', ...pattern(2) };
export const PaginationPattern3 = { name: 'Hover effect', ...pattern(3) };
export const PaginationPattern4 = { name: 'Circle buttons', ...pattern(4) };
export const PaginationPattern5 = { name: 'Go-to-page input', ...pattern(5) };
export const PaginationPattern6 = { name: 'Numbered in a card', ...pattern(6) };
export const PaginationPattern7 = { name: 'Arrow buttons', ...pattern(7) };
export const PaginationPattern8 = { name: 'Centered page info', ...pattern(8) };
export const PaginationPattern9 = { name: 'Page info on the left', ...pattern(9) };
export const PaginationPattern10 = { name: 'Ellipsis', ...pattern(10) };
export const PaginationPattern11 = { name: 'Outline buttons', ...pattern(11) };
export const PaginationPattern12 = { name: 'Rows per page and range info', ...pattern(12) };
export const PaginationPattern13 = { name: 'Page select with first and last', ...pattern(13) };
export const PaginationPattern14 = { name: 'Numbered with go-to-page input', ...pattern(14) };
export const PaginationPattern15 = { name: 'Page info, ellipsis, and per-page select', ...pattern(15) };

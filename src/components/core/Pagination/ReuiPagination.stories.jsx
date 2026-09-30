// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'pagination',
  import.meta.glob('../../../../.storybook/fixtures/reui/pagination/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/pagination/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Navigation/Pagination', tags: ['autodocs'], ...catalogueMeta('pagination') };

export const ReuiPagination1 = { name: 'Basic', ...pattern(1) };
export const ReuiPagination2 = { name: 'Icon-only arrows', ...pattern(2) };
export const ReuiPagination3 = { name: 'Hover effect', ...pattern(3) };
export const ReuiPagination4 = { name: 'Circle buttons', ...pattern(4) };
export const ReuiPagination5 = { name: 'Go-to-page input', ...pattern(5) };
export const ReuiPagination6 = { name: 'Numbered in a card', ...pattern(6) };
export const ReuiPagination7 = { name: 'Arrow buttons', ...pattern(7) };
export const ReuiPagination8 = { name: 'Centered page info', ...pattern(8) };
export const ReuiPagination9 = { name: 'Page info on the left', ...pattern(9) };
export const ReuiPagination10 = { name: 'Ellipsis', ...pattern(10) };
export const ReuiPagination11 = { name: 'Outline buttons', ...pattern(11) };
export const ReuiPagination12 = { name: 'Rows per page and range info', ...pattern(12) };
export const ReuiPagination13 = { name: 'Page select with first and last', ...pattern(13) };
export const ReuiPagination14 = { name: 'Numbered with go-to-page input', ...pattern(14) };
export const ReuiPagination15 = { name: 'Page info, ellipsis, and per-page select', ...pattern(15) };

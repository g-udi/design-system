// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'pagination',
  import.meta.glob('../../../../.storybook/fixtures/reui/pagination/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/pagination/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Navigation/Pagination', tags: ['autodocs'], ...catalogueMeta('pagination') };

export const ReuiPagination1 = { name: 'Basic pagination', ...pattern(1) };
export const ReuiPagination2 = { name: 'Pagination without labels', ...pattern(2) };
export const ReuiPagination3 = { name: 'Pagination with hover effect', ...pattern(3) };
export const ReuiPagination4 = { name: 'Pagination with circle buttons', ...pattern(4) };
export const ReuiPagination5 = { name: 'Pagination with go-to-page input', ...pattern(5) };
export const ReuiPagination6 = { name: 'Numbered pagination in card', ...pattern(6) };
export const ReuiPagination7 = { name: 'Pagination with arrows buttons', ...pattern(7) };
export const ReuiPagination8 = { name: 'Pagination with page info on center', ...pattern(8) };
export const ReuiPagination9 = { name: 'Pagination with page info on left', ...pattern(9) };
export const ReuiPagination10 = { name: 'Pagination with ellipsis indicator', ...pattern(10) };
export const ReuiPagination11 = { name: 'Pagination with outline style buttons', ...pattern(11) };
export const ReuiPagination12 = { name: 'Rows per page select with range info and first/prev/next/last icons', ...pattern(12) };
export const ReuiPagination13 = { name: 'Pagination with page select dropdown and first/last navigation', ...pattern(13) };
export const ReuiPagination14 = { name: 'Numbered pagination with go-to-page input', ...pattern(14) };
export const ReuiPagination15 = { name: 'Pagination with page info, numbered pages, ellipsis, and per-page select', ...pattern(15) };

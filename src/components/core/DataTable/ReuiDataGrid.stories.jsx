// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'data-grid',
  import.meta.glob('../../../../.storybook/fixtures/reui/data-grid/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/data-grid/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DataTable', tags: ['autodocs'], ...catalogueMeta('data-grid') };

export const ReuiDataGrid1 = { name: 'Pagination', ...pattern(1) };
export const ReuiDataGrid2 = { name: 'Cell borders', ...pattern(2) };
export const ReuiDataGrid3 = { name: 'Dense layout', ...pattern(3) };
export const ReuiDataGrid4 = { name: 'Without table borders', ...pattern(4) };
export const ReuiDataGrid5 = { name: 'Striped rows', ...pattern(5) };
export const ReuiDataGrid6 = { name: 'Auto width layout', ...pattern(6) };
export const ReuiDataGrid7 = { name: 'Row selection', ...pattern(7) };
export const ReuiDataGrid8 = { name: 'Expandable rows', ...pattern(8) };
export const ReuiDataGrid9 = { name: 'Sub table', ...pattern(9) };
export const ReuiDataGrid10 = { name: 'Column icons', ...pattern(10) };
export const ReuiDataGrid11 = { name: 'Sortable columns', ...pattern(11) };
export const ReuiDataGrid12 = { name: 'Movable columns', ...pattern(12) };
export const ReuiDataGrid13 = { name: 'Draggable columns', ...pattern(13) };
export const ReuiDataGrid14 = { name: 'Draggable rows', ...pattern(14) };
export const ReuiDataGrid15 = { name: 'Column resizing', ...pattern(15) };
export const ReuiDataGrid16 = { name: 'Pinnable columns', ...pattern(16) };
export const ReuiDataGrid17 = { name: 'Sticky header', ...pattern(17) };
export const ReuiDataGrid18 = { name: 'Column controls', ...pattern(18) };
export const ReuiDataGrid19 = { name: 'Card container', ...pattern(19) };
export const ReuiDataGrid20 = { name: 'Column visibility controls', ...pattern(20) };
export const ReuiDataGrid21 = { name: 'Loading skeleton', ...pattern(21) };
export const ReuiDataGrid22 = { name: 'CRUD features', ...pattern(22) };
export const ReuiDataGrid23 = { name: 'CRUD in a frame', ...pattern(23) };
export const ReuiDataGrid24 = { name: 'Column totals footer', ...pattern(24) };
export const ReuiDataGrid25 = { name: 'Summary stats footer', ...pattern(25) };
export const ReuiDataGrid26 = { name: 'Per-column aggregate footer', ...pattern(26) };
export const ReuiDataGrid27 = { name: 'Local infinite scroll', ...pattern(27) };
export const ReuiDataGrid28 = { name: 'Remote infinite scroll', ...pattern(28) };
export const ReuiDataGrid29 = { name: 'Row pinning', ...pattern(29) };
export const ReuiDataGrid30 = { name: 'Tree rows', ...pattern(30) };
export const ReuiDataGrid31 = { name: 'Spreadsheet editing', ...pattern(31) };
export const ReuiDataGrid32 = { name: 'Column virtualization', ...pattern(32) };
export const ReuiDataGrid33 = { name: 'Localized labels', ...pattern(33) };
export const ReuiDataGrid34 = { name: 'Server-side pagination', ...pattern(34, 'Data grid with server side pagination, sorting, search and status filter') };

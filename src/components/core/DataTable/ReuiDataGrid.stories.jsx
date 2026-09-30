// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'data-grid',
  import.meta.glob('../../../../.storybook/fixtures/reui/data-grid/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/data-grid/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DataTable', tags: ['autodocs'], ...catalogueMeta('data-grid') };

export const ReuiDataGrid1 = { name: 'Data Grid: Data grid with pagination', ...pattern(1) };
export const ReuiDataGrid2 = { name: 'Data Grid: Data grid with cell border', ...pattern(2) };
export const ReuiDataGrid3 = { name: 'Data Grid: Data grid with dense layout', ...pattern(3) };
export const ReuiDataGrid4 = { name: 'Data Grid: Data grid without table borders', ...pattern(4) };
export const ReuiDataGrid5 = { name: 'Data Grid: Data grid with striped rows', ...pattern(5) };
export const ReuiDataGrid6 = { name: 'Data Grid: Data grid with auto width table layout', ...pattern(6) };
export const ReuiDataGrid7 = { name: 'Data Grid: Data grid with row selection', ...pattern(7) };
export const ReuiDataGrid8 = { name: 'Data Grid: Data grid with expandable rows', ...pattern(8) };
export const ReuiDataGrid9 = { name: 'Data Grid: Data grid with sub table', ...pattern(9) };
export const ReuiDataGrid10 = { name: 'Data Grid: Data grid with column icons', ...pattern(10) };
export const ReuiDataGrid11 = { name: 'Data Grid: Data grid with sortable columns', ...pattern(11) };
export const ReuiDataGrid12 = { name: 'Data Grid: Data grid with movable columns', ...pattern(12) };
export const ReuiDataGrid13 = { name: 'Data Grid: Data grid with draggable columns', ...pattern(13) };
export const ReuiDataGrid14 = { name: 'Data Grid: Data grid with draggable rows', ...pattern(14) };
export const ReuiDataGrid15 = { name: 'Data Grid: Data grid with column resizing', ...pattern(15) };
export const ReuiDataGrid16 = { name: 'Data Grid: Data grid with pinnable columns', ...pattern(16) };
export const ReuiDataGrid17 = { name: 'Data Grid: Data grid with sticky header', ...pattern(17) };
export const ReuiDataGrid18 = { name: 'Data Grid: Data grid with column controls', ...pattern(18) };
export const ReuiDataGrid19 = { name: 'Data Grid: Data grid with card container', ...pattern(19) };
export const ReuiDataGrid20 = { name: 'Data Grid: Data grid with column visibility controls', ...pattern(20) };
export const ReuiDataGrid21 = { name: 'Data Grid: Data grid with loading skeleton', ...pattern(21) };
export const ReuiDataGrid22 = { name: 'Data Grid: Data grid with CRUD features', ...pattern(22) };
export const ReuiDataGrid23 = { name: 'Data Grid: Data grid with CRUD in frame container', ...pattern(23) };
export const ReuiDataGrid24 = { name: 'Data Grid: Data grid with column totals footer', ...pattern(24) };
export const ReuiDataGrid25 = { name: 'Data Grid: Data grid with summary stats footer', ...pattern(25) };
export const ReuiDataGrid26 = { name: 'Data Grid: Data grid with per-column aggregate footer', ...pattern(26) };
export const ReuiDataGrid27 = { name: 'Data Grid: Data grid with local infinite scroll', ...pattern(27) };
export const ReuiDataGrid28 = { name: 'Data Grid: Data grid with remote infinite scroll', ...pattern(28) };
export const ReuiDataGrid29 = { name: 'Data Grid: Data grid with row pinning support', ...pattern(29) };
export const ReuiDataGrid30 = { name: 'Data Grid: Data grid with tree rows', ...pattern(30) };
export const ReuiDataGrid31 = { name: 'Data Grid: Data grid with spreadsheet editing', ...pattern(31) };
export const ReuiDataGrid32 = { name: 'Data Grid: Data grid with column virtualization', ...pattern(32) };
export const ReuiDataGrid33 = { name: 'Data Grid: Data grid with localized labels', ...pattern(33) };
export const ReuiDataGrid34 = { name: 'Data Grid: Data grid with server side pagination', ...pattern(34, 'Data grid with server side pagination, sorting, search and status filter') };

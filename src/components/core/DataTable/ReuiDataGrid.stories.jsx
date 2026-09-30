// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'data-grid',
  import.meta.glob('../../../../.storybook/fixtures/reui/data-grid/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/data-grid/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DataTable', tags: ['autodocs'], ...catalogueMeta('data-grid') };

export const ReuiDataGrid1 = { name: 'Layout options', ...pattern(1, 'Every tableLayout flag on one grid: density, cell and row borders, stripes, rounded rows, header fill, sticky header and auto width.') };
export const ReuiDataGrid19 = { name: 'Column controls', ...pattern(19, 'Header menus sort, pin, move and hide columns; edges resize them; header icons label each field.') };
export const ReuiDataGrid29 = { name: 'Selection, expansion and pinned rows', ...pattern(29, 'Select rows, expand a row for details, and pin rows above the page while sorting and paging.') };
export const ReuiDataGrid14 = { name: 'Draggable rows and columns', ...pattern(14) };
export const ReuiDataGrid26 = { name: 'Footer totals and aggregates', ...pattern(26, 'A footer row with the record count, averages and ranges per column.') };
export const ReuiDataGrid30 = { name: 'Tree rows', ...pattern(30) };
export const ReuiDataGrid9 = { name: 'Sub table', ...pattern(9) };
export const ReuiDataGrid31 = { name: 'Spreadsheet editing', ...pattern(31) };
export const ReuiDataGrid23 = { name: 'CRUD in a frame', ...pattern(23) };
export const ReuiDataGrid34 = { name: 'Server-side pagination', ...pattern(34, 'Server-side pagination, sorting, search and a status filter, with a loading skeleton while each page arrives.') };
export const ReuiDataGrid28 = { name: 'Infinite scroll', ...pattern(28, 'Rows load from a remote source as the list scrolls.') };
export const ReuiDataGrid32 = { name: 'Column virtualization', ...pattern(32) };

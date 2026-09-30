import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'data-grid',
  import.meta.glob('../../../../.storybook/fixtures/patterns/data-grid/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/data-grid/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/DataTable', id: 'core-datatable', tags: ['autodocs'], ...catalogueMeta('data-grid') };

export const DataGridPattern1 = { name: 'Layout options', ...pattern(1, 'Every tableLayout flag on one grid: density, cell and row borders, stripes, rounded rows, header fill, sticky header and auto width.') };
export const DataGridPattern19 = { name: 'Column controls', ...pattern(19, 'Header menus sort, pin, move and hide columns; edges resize them; header icons label each field.') };
export const DataGridPattern29 = { name: 'Selection, expansion and pinned rows', ...pattern(29, 'Select rows, expand a row for details, and pin rows above the page while sorting and paging.') };
export const DataGridPattern14 = { name: 'Draggable rows and columns', ...pattern(14) };
export const DataGridPattern26 = { name: 'Footer totals and aggregates', ...pattern(26, 'A footer row with the record count, averages and ranges per column.') };
export const DataGridPattern30 = { name: 'Tree rows', ...pattern(30) };
export const DataGridPattern9 = { name: 'Sub table', ...pattern(9) };
export const DataGridPattern31 = { name: 'Spreadsheet editing', ...pattern(31) };
export const DataGridPattern23 = { name: 'CRUD in a frame', ...pattern(23) };
export const DataGridPattern34 = { name: 'Server-side pagination', ...pattern(34, 'Server-side pagination, sorting, search and a status filter, with a loading skeleton while each page arrives.') };
export const DataGridPattern28 = { name: 'Infinite scroll', ...pattern(28, 'Rows load from a remote source as the list scrolls.') };
export const DataGridPattern32 = { name: 'Column virtualization', ...pattern(32) };

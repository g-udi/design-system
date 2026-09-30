import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'filters',
  import.meta.glob('../../../../.storybook/fixtures/patterns/filters/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/filters/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/FilterBar', tags: ['autodocs'], ...catalogueMeta('filters') };

export const FiltersPattern1 = { name: 'Everything in one filter bar', ...pattern(1, 'Multi-select, nested fields, async options and stacked values.') };
export const FiltersPattern2 = { name: 'Nested attributes at workspace scale', ...pattern(2, 'Drill-down groups, a filterable branch and deep search.') };
export const FiltersPattern3 = { name: 'Status and priority colour badges', ...pattern(3, 'Colour-coded options and badges in the chip.') };
export const FiltersPattern4 = { name: 'Avatars, paging and a restored view', ...pattern(4, 'Avatar options, results paged over the wire and a saved view.') };
export const FiltersPattern5 = { name: 'A date and a date range editor', ...pattern(5, 'Consumer-owned date and date range controls.') };
export const FiltersPattern6 = { name: 'Sliders as the value editor', ...pattern(6, 'One slider editor for range and single-value operators.') };
export const FiltersPattern7 = { name: 'Filtering a table', ...pattern(7, 'The query tree compiled to a row predicate.') };
export const FiltersPattern8 = { name: 'Choice controls as editors', ...pattern(8, 'Toggle group, radios, checkboxes, select and switch.') };
export const FiltersPattern9 = { name: 'Typed values in shadcn inputs', ...pattern(9, 'An input group, a term list, code slots and a validated domain.') };
export const FiltersPattern10 = { name: 'Nested groups in a popover', ...pattern(10, 'A data grid paged, sorted and totalled under a popover builder.') };
export const FiltersPattern11 = { name: 'Nested groups inline, walked back out', ...pattern(11, 'The builder inline, beside its own tree read back as an expression.') };
export const FiltersPattern12 = { name: 'Controlled, sized and translated', ...pattern(12, 'One controlled query, three locales and every change reported.') };

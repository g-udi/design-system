// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'filters',
  import.meta.glob('../../../../.storybook/fixtures/reui/filters/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/filters/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/FilterBar', tags: ['autodocs'], ...catalogueMeta('filters') };

export const ReuiFilters1 = { name: 'Filters: Everything in one filter bar', ...pattern(1, 'Multi-select, nested fields, async options and stacked values.') };
export const ReuiFilters2 = { name: 'Filters: Nested attributes at workspace scale', ...pattern(2, 'Drill-down groups, a filterable branch and deep search.') };
export const ReuiFilters3 = { name: 'Filters: Status and priority colour badges', ...pattern(3, 'Colour-coded options and badges in the chip.') };
export const ReuiFilters4 = { name: 'Filters: Avatars, paging and a restored view', ...pattern(4, 'Avatar options, results paged over the wire and a saved view.') };
export const ReuiFilters5 = { name: 'Filters: A date and a date range editor', ...pattern(5, 'Consumer-owned date and date range controls.') };
export const ReuiFilters6 = { name: 'Filters: Sliders as the value editor', ...pattern(6, 'One slider editor for range and single-value operators.') };
export const ReuiFilters7 = { name: 'Filters: Filtering a table', ...pattern(7, 'The query tree compiled to a row predicate.') };
export const ReuiFilters8 = { name: 'Filters: Choice controls as editors', ...pattern(8, 'Toggle group, radios, checkboxes, select and switch.') };
export const ReuiFilters9 = { name: 'Filters: Typed values in shadcn inputs', ...pattern(9, 'An input group, a term list, code slots and a validated domain.') };
export const ReuiFilters10 = { name: 'Filters: Nested groups in a popover', ...pattern(10, 'A data grid paged, sorted and totalled under a popover builder.') };
export const ReuiFilters11 = { name: 'Filters: Nested groups inline, walked back out', ...pattern(11, 'The builder inline, beside its own tree read back as an expression.') };
export const ReuiFilters12 = { name: 'Filters: Controlled, sized and translated', ...pattern(12, 'One controlled query, three locales and every change reported.') };

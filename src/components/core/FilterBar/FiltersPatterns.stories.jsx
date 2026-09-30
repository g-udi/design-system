import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'filters',
  import.meta.glob('../../../../.storybook/fixtures/patterns/filters/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/filters/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/FilterBar', id: 'core-filterbar', tags: ['autodocs'], ...catalogueMeta('filters') };

export const FiltersPattern1 = { name: 'Everything in one filter bar', ...pattern(1, 'Multi-select with pinned picks, badges or stacked values in the chip, nested fields, async paged options, a restored saved view, and the query it produces.') };
export const FiltersPattern10 = { name: 'Filtering a table with nested groups', ...pattern(10, 'A popover builder with nested groups, compiled to a row predicate over a data grid that pages, sorts and totals the matches.') };
export const FiltersPattern5 = { name: 'Custom value editors', ...pattern(5, 'Consumer-owned editors on one bar: date and date range pickers, sliders, choice controls, and typed inputs with validation.') };
export const FiltersPattern2 = { name: 'Nested attributes at workspace scale', ...pattern(2, 'Drill-down groups, a filterable branch and deep search.') };
export const FiltersPattern11 = { name: 'Nested groups inline, walked back out', ...pattern(11, 'The builder inline, beside its own tree read back as an expression.') };
export const FiltersPattern12 = { name: 'Controlled, sized and translated', ...pattern(12, 'One controlled query, three locales and every change reported.') };

import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'date-selector',
  import.meta.glob('../../../../.storybook/fixtures/patterns/date-selector/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/date-selector/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/Calendar', id: 'core-calendar', tags: ['autodocs'], ...catalogueMeta('date-selector') };

export const DateSelectorPattern1 = { name: 'Date selector: Options', ...pattern(1, 'Days, months, quarters, half-years and years with is, before, after and between filters; switches toggle ranges and the typed input, and the value is printed below.') };
export const DateSelectorPattern2 = { name: 'Date selector: In a popover', ...pattern(2, 'Edits a draft in a popover and commits it with Apply.') };
export const DateSelectorPattern4 = { name: 'Date selector: Translated, in a dialog', ...pattern(4, 'A dialog with Apply and Cancel whose strings, date format and first weekday follow the chosen language.') };

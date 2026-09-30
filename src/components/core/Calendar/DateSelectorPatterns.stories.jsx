import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'date-selector',
  import.meta.glob('../../../../.storybook/fixtures/patterns/date-selector/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/date-selector/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Calendar', tags: ['autodocs'], ...catalogueMeta('date-selector') };

export const DateSelectorPattern1 = { name: 'Date selector: Basic', ...pattern(1) };
export const DateSelectorPattern2 = { name: 'Date selector: In a popover', ...pattern(2) };
export const DateSelectorPattern3 = { name: 'Date selector: In a dialog', ...pattern(3) };
export const DateSelectorPattern4 = { name: 'Date selector: In a dropdown menu', ...pattern(4) };

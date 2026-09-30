import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'select',
  import.meta.glob('../../../../.storybook/fixtures/patterns/select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('select') };

export const SelectPattern1 = { name: 'Basic select', ...pattern(1) };
export const SelectPattern2 = { name: 'Select with icons and placeholder', ...pattern(2) };
export const SelectPattern3 = { name: 'Grouped select', ...pattern(3) };
export const SelectPattern4 = { name: 'Select with a long list', ...pattern(4) };
export const SelectPattern5 = { name: 'Small select', ...pattern(5) };
export const SelectPattern6 = { name: 'Subscription plan select', ...pattern(6) };
export const SelectPattern7 = { name: 'Select without item alignment', ...pattern(7) };
export const SelectPattern8 = { name: 'Select in a field', ...pattern(8) };
export const SelectPattern9 = { name: 'Invalid select', ...pattern(9) };
export const SelectPattern10 = { name: 'Disabled select', ...pattern(10) };
export const SelectPattern11 = { name: 'Select inside a dialog', ...pattern(11) };
export const SelectPattern12 = { name: 'Select with single selection', ...pattern(12) };
export const SelectPattern13 = { name: 'Select inline with input', ...pattern(13) };
export const SelectPattern14 = { name: 'Select beside a button', ...pattern(14) };
export const SelectPattern15 = { name: 'Select with item alignment', ...pattern(15) };
export const SelectPattern16 = { name: 'Access level select', ...pattern(16) };
export const SelectPattern17 = { name: 'Select with status bullets', ...pattern(17) };
export const SelectPattern18 = { name: 'Select with avatars', ...pattern(18) };
export const SelectPattern19 = { name: 'Select with status badges', ...pattern(19) };
export const SelectPattern20 = { name: 'Select with left indicator', ...pattern(20) };
export const SelectPattern21 = { name: 'Select with clear button', ...pattern(21) };
export const SelectPattern22 = { name: 'Select with up-down chevrons', ...pattern(22) };
export const SelectPattern23 = { name: 'Select with status dots', ...pattern(23) };
export const SelectPattern24 = { name: 'Select with groups and separators', ...pattern(24) };
export const SelectPattern25 = { name: 'Country picker', ...pattern(25) };
export const SelectPattern26 = { name: 'Status filter', ...pattern(26) };
export const SelectPattern27 = { name: 'Select with option descriptions', ...pattern(27) };
export const SelectPattern28 = { name: 'Time zone select', ...pattern(28) };
export const SelectPattern29 = { name: 'Team member select', ...pattern(29) };
export const SelectPattern30 = { name: 'Priority select', ...pattern(30) };
export const SelectPattern31 = { name: 'Font family select', ...pattern(31) };
export const SelectPattern32 = { name: 'Category select with icons', ...pattern(32) };
export const SelectPattern33 = { name: 'Size select', ...pattern(33) };

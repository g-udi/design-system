import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'autocomplete',
  import.meta.glob('../../../../.storybook/fixtures/patterns/autocomplete/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/autocomplete/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('autocomplete') };

export const AutocompletePattern1 = { name: 'Basic autocomplete', ...pattern(1) };
export const AutocompletePattern2 = { name: 'Disabled autocomplete', ...pattern(2) };
export const AutocompletePattern3 = { name: 'Autocomplete with auto highlight', ...pattern(3) };
export const AutocompletePattern4 = { name: 'Autocomplete with label', ...pattern(4) };
export const AutocompletePattern5 = { name: 'Autocomplete with clear button', ...pattern(5) };
export const AutocompletePattern6 = { name: 'Autocomplete with trigger button', ...pattern(6) };
export const AutocompletePattern7 = { name: 'Autocomplete with clear and trigger buttons', ...pattern(7) };
export const AutocompletePattern8 = { name: 'Autocomplete with groups', ...pattern(8) };
export const AutocompletePattern9 = { name: 'Autocomplete with search results', ...pattern(9) };
export const AutocompletePattern10 = { name: 'Small autocomplete', ...pattern(10) };
export const AutocompletePattern11 = { name: 'Large autocomplete', ...pattern(11) };
export const AutocompletePattern12 = { name: 'Autocomplete in a form', ...pattern(12) };

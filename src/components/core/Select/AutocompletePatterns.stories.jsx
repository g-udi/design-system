import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'autocomplete',
  import.meta.glob('../../../../.storybook/fixtures/patterns/autocomplete/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/autocomplete/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('autocomplete') };

export const AutocompletePattern1 = {
  name: 'Input options',
  ...pattern(1, 'One field per input option: auto highlight, clear and trigger buttons, disabled, and the small and large sizes.')
};
export const AutocompletePattern8 = { name: 'Grouped people search', ...pattern(8) };
export const AutocompletePattern9 = { name: 'Async search results', ...pattern(9) };
export const AutocompletePattern12 = { name: 'Autocomplete in a form', ...pattern(12) };

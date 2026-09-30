import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'autocomplete',
  import.meta.glob('../../../../.storybook/fixtures/patterns/autocomplete/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/autocomplete/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('autocomplete') };

export const AutocompletePattern1 = {
  name: 'Input options',
  ...pattern(1, 'One field per input option: auto highlight, clear and trigger buttons, disabled, and the small and large sizes.')
};
export const AutocompletePattern8 = { name: 'Grouped people search', ...pattern(8, 'People grouped by team with avatars and roles, filtered as you type a name or role.') };
export const AutocompletePattern9 = { name: 'Async search results', ...pattern(9, 'A debounced remote search that announces loading, empty, error and result counts.') };
export const AutocompletePattern12 = { name: 'Autocomplete in a form', ...pattern(12, 'A validated form field that shows its error on submit.') };

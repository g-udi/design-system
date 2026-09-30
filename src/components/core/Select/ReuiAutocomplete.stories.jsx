// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'autocomplete',
  import.meta.glob('../../../../.storybook/fixtures/reui/autocomplete/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/autocomplete/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('autocomplete') };

export const ReuiAutocomplete1 = { name: 'Basic autocomplete', ...pattern(1) };
export const ReuiAutocomplete2 = { name: 'Disabled autocomplete', ...pattern(2) };
export const ReuiAutocomplete3 = { name: 'Autocomplete with auto highlight', ...pattern(3) };
export const ReuiAutocomplete4 = { name: 'Autocomplete with label', ...pattern(4) };
export const ReuiAutocomplete5 = { name: 'Autocomplete with clear button', ...pattern(5) };
export const ReuiAutocomplete6 = { name: 'Autocomplete with trigger button', ...pattern(6) };
export const ReuiAutocomplete7 = { name: 'Autocomplete with clear and trigger buttons', ...pattern(7) };
export const ReuiAutocomplete8 = { name: 'Autocomplete with groups', ...pattern(8) };
export const ReuiAutocomplete9 = { name: 'Autocomplete with search results', ...pattern(9) };
export const ReuiAutocomplete10 = { name: 'Small autocomplete', ...pattern(10) };
export const ReuiAutocomplete11 = { name: 'Large autocomplete', ...pattern(11) };
export const ReuiAutocomplete12 = { name: 'Autocomplete in a form', ...pattern(12) };

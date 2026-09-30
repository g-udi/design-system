// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'autocomplete',
  import.meta.glob('../../../../.storybook/fixtures/reui/autocomplete/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/autocomplete/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('autocomplete') };

export const ReuiAutocomplete1 = { name: 'Autocomplete: Basic autocomplete control', ...pattern(1) };
export const ReuiAutocomplete2 = { name: 'Autocomplete: Disabled state', ...pattern(2) };
export const ReuiAutocomplete3 = { name: 'Autocomplete: Auto highlight option as you type', ...pattern(3) };
export const ReuiAutocomplete4 = { name: 'Autocomplete: Control with label', ...pattern(4) };
export const ReuiAutocomplete5 = { name: 'Autocomplete: With clear button', ...pattern(5) };
export const ReuiAutocomplete6 = { name: 'Autocomplete: With trigger button', ...pattern(6) };
export const ReuiAutocomplete7 = { name: 'Autocomplete: With clear and trigger buttons', ...pattern(7) };
export const ReuiAutocomplete8 = { name: 'Autocomplete: With groups and labels', ...pattern(8) };
export const ReuiAutocomplete9 = { name: 'Autocomplete: With search results', ...pattern(9) };
export const ReuiAutocomplete10 = { name: 'Autocomplete: Small autocomplete', ...pattern(10) };
export const ReuiAutocomplete11 = { name: 'Autocomplete: Large autocomplete', ...pattern(11) };
export const ReuiAutocomplete12 = { name: 'Autocomplete: Form integration', ...pattern(12) };

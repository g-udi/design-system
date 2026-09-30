// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'select',
  import.meta.glob('../../../../.storybook/fixtures/reui/select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('select') };

export const ReuiSelect1 = { name: 'Basic select', ...pattern(1) };
export const ReuiSelect2 = { name: 'Select with icons and placeholder', ...pattern(2) };
export const ReuiSelect3 = { name: 'Grouped select', ...pattern(3) };
export const ReuiSelect4 = { name: 'Select with a long list', ...pattern(4) };
export const ReuiSelect5 = { name: 'Small select', ...pattern(5) };
export const ReuiSelect6 = { name: 'Subscription plan select', ...pattern(6) };
export const ReuiSelect7 = { name: 'Select without item alignment', ...pattern(7) };
export const ReuiSelect8 = { name: 'Select in a field', ...pattern(8) };
export const ReuiSelect9 = { name: 'Invalid select', ...pattern(9) };
export const ReuiSelect10 = { name: 'Disabled select', ...pattern(10) };
export const ReuiSelect11 = { name: 'Select inside a dialog', ...pattern(11) };
export const ReuiSelect12 = { name: 'Select with single selection', ...pattern(12) };
export const ReuiSelect13 = { name: 'Select inline with input', ...pattern(13) };
export const ReuiSelect14 = { name: 'Select beside a button', ...pattern(14) };
export const ReuiSelect15 = { name: 'Select with item alignment', ...pattern(15) };
export const ReuiSelect16 = { name: 'Access level select', ...pattern(16) };
export const ReuiSelect17 = { name: 'Select with status bullets', ...pattern(17) };
export const ReuiSelect18 = { name: 'Select with avatars', ...pattern(18) };
export const ReuiSelect19 = { name: 'Select with status badges', ...pattern(19) };
export const ReuiSelect20 = { name: 'Select with left indicator', ...pattern(20) };
export const ReuiSelect21 = { name: 'Select with clear button', ...pattern(21) };
export const ReuiSelect22 = { name: 'Select with up-down chevrons', ...pattern(22) };
export const ReuiSelect23 = { name: 'Select with status dots', ...pattern(23) };
export const ReuiSelect24 = { name: 'Select with groups and separators', ...pattern(24) };
export const ReuiSelect25 = { name: 'Country picker', ...pattern(25) };
export const ReuiSelect26 = { name: 'Status filter', ...pattern(26) };
export const ReuiSelect27 = { name: 'Select with option descriptions', ...pattern(27) };
export const ReuiSelect28 = { name: 'Time zone select', ...pattern(28) };
export const ReuiSelect29 = { name: 'Team member select', ...pattern(29) };
export const ReuiSelect30 = { name: 'Priority select', ...pattern(30) };
export const ReuiSelect31 = { name: 'Font family select', ...pattern(31) };
export const ReuiSelect32 = { name: 'Category select with icons', ...pattern(32) };
export const ReuiSelect33 = { name: 'Size select', ...pattern(33) };

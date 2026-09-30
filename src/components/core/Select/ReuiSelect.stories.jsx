// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'select',
  import.meta.glob('../../../../.storybook/fixtures/reui/select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('select') };

export const ReuiSelect1 = { name: 'A basic select component with a list of options', ...pattern(1) };
export const ReuiSelect2 = { name: 'Select with icons and placeholder state', ...pattern(2) };
export const ReuiSelect3 = { name: 'Select component with grouped options and labels', ...pattern(3) };
export const ReuiSelect4 = { name: 'Select component with a large list of options', ...pattern(4) };
export const ReuiSelect5 = { name: 'Select component with small trigger size', ...pattern(5) };
export const ReuiSelect6 = { name: 'Select component with a subscription plan style', ...pattern(6) };
export const ReuiSelect7 = { name: 'Select component with item alignment disabled', ...pattern(7) };
export const ReuiSelect8 = { name: 'Select component within a Field with label and description', ...pattern(8) };
export const ReuiSelect9 = { name: 'Select component in an invalid state', ...pattern(9) };
export const ReuiSelect10 = { name: 'Select component in a disabled state', ...pattern(10) };
export const ReuiSelect11 = { name: 'Select component inside a Dialog', ...pattern(11) };
export const ReuiSelect12 = { name: 'Select component with single selection', ...pattern(12) };
export const ReuiSelect13 = { name: 'Select component inline with Input', ...pattern(13) };
export const ReuiSelect14 = { name: 'Select component with Button side by side', ...pattern(14) };
export const ReuiSelect15 = { name: 'Select component with item alignment enabled', ...pattern(15) };
export const ReuiSelect16 = { name: 'Select with custom access level descriptions', ...pattern(16) };
export const ReuiSelect17 = { name: 'Select with colored bullets for status', ...pattern(17) };
export const ReuiSelect18 = { name: 'Select with user avatars', ...pattern(18) };
export const ReuiSelect19 = { name: 'Select with status badges', ...pattern(19) };
export const ReuiSelect20 = { name: 'Select with indicator on the left side', ...pattern(20) };
export const ReuiSelect21 = { name: 'Select with clear button', ...pattern(21) };
export const ReuiSelect22 = { name: 'Select with custom chevrons up down icon', ...pattern(22) };
export const ReuiSelect23 = { name: 'Select with colored status dots', ...pattern(23) };
export const ReuiSelect24 = { name: 'Select with grouped options and separators', ...pattern(24) };
export const ReuiSelect25 = { name: 'Country picker select with flag emojis', ...pattern(25) };
export const ReuiSelect26 = { name: 'Status filter select with colored dots', ...pattern(26) };
export const ReuiSelect27 = { name: 'Select with description text per option', ...pattern(27) };
export const ReuiSelect28 = { name: 'Timezone select with UTC offsets', ...pattern(28) };
export const ReuiSelect29 = { name: 'Select with avatar items for team member assignment', ...pattern(29) };
export const ReuiSelect30 = { name: 'Priority select with colored badges', ...pattern(30) };
export const ReuiSelect31 = { name: 'Font family select with preview', ...pattern(31) };
export const ReuiSelect32 = { name: 'Select with icon-labeled categories', ...pattern(32) };
export const ReuiSelect33 = { name: 'Size variant select with small trigger', ...pattern(33) };

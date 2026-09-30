// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'checkbox',
  import.meta.glob('../../../../.storybook/fixtures/reui/checkbox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/checkbox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Checkbox', tags: ['autodocs'], ...catalogueMeta('checkbox') };

export const ReuiCheckbox1 = { name: 'With label', ...pattern(1) };
export const ReuiCheckbox2 = { name: 'Disabled', ...pattern(2) };
export const ReuiCheckbox3 = { name: 'Invalid', ...pattern(3) };
export const ReuiCheckbox4 = { name: 'Indeterminate', ...pattern(4) };
export const ReuiCheckbox5 = { name: 'Label and description', ...pattern(5) };
export const ReuiCheckbox6 = { name: 'Custom colour', ...pattern(6) };
export const ReuiCheckbox7 = { name: 'Circle', ...pattern(7) };
export const ReuiCheckbox8 = { name: 'Group', ...pattern(8) };
export const ReuiCheckbox9 = { name: 'Card group', ...pattern(9) };
export const ReuiCheckbox10 = { name: 'Group in a frame', ...pattern(10) };
export const ReuiCheckbox11 = { name: 'Stacked card group', ...pattern(11) };
export const ReuiCheckbox12 = { name: 'Stacked card group with icons', ...pattern(12) };
export const ReuiCheckbox13 = { name: 'Corner badge cards', ...pattern(13) };
export const ReuiCheckbox14 = { name: 'Corner checkbox cards with icons', ...pattern(14) };
export const ReuiCheckbox15 = { name: 'Avatar cards', ...pattern(15) };
export const ReuiCheckbox16 = { name: 'Nested group', ...pattern(16) };
export const ReuiCheckbox17 = { name: 'Payment method cards', ...pattern(17) };
export const ReuiCheckbox18 = { name: 'Label with info tooltip', ...pattern(18) };
export const ReuiCheckbox19 = { name: 'Group with badges', ...pattern(19) };
export const ReuiCheckbox20 = { name: 'Label with info tooltip, alternate', ...pattern(20) };
export const ReuiCheckbox21 = { name: 'Inline horizontal group', ...pattern(21) };
export const ReuiCheckbox22 = { name: 'Feature badge', ...pattern(22) };

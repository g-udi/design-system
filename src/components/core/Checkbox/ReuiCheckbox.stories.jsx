// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'checkbox',
  import.meta.glob('../../../../.storybook/fixtures/reui/checkbox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/checkbox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Checkbox', tags: ['autodocs'], ...catalogueMeta('checkbox') };

export const ReuiCheckbox1 = { name: 'Basic checkbox with label', ...pattern(1) };
export const ReuiCheckbox2 = { name: 'Disabled checkbox', ...pattern(2) };
export const ReuiCheckbox3 = { name: 'Invalid checkbox', ...pattern(3) };
export const ReuiCheckbox4 = { name: 'Indeterminate checkbox', ...pattern(4) };
export const ReuiCheckbox5 = { name: 'Checkbox with label and description', ...pattern(5) };
export const ReuiCheckbox6 = { name: 'Colored checkbox', ...pattern(6) };
export const ReuiCheckbox7 = { name: 'Circle checkbox', ...pattern(7) };
export const ReuiCheckbox8 = { name: 'Checkbox group', ...pattern(8) };
export const ReuiCheckbox9 = { name: 'Card checkbox with group', ...pattern(9) };
export const ReuiCheckbox10 = { name: 'Checkbox group in a frame', ...pattern(10) };
export const ReuiCheckbox11 = { name: 'Card checkbox group with icons', ...pattern(11) };
export const ReuiCheckbox12 = { name: 'Card checkbox group with icons', ...pattern(12) };
export const ReuiCheckbox13 = { name: 'Custom positioned checkbox', ...pattern(13) };
export const ReuiCheckbox14 = { name: 'Custom positioned checkbox', ...pattern(14) };
export const ReuiCheckbox15 = { name: 'Avatar based card checkbox', ...pattern(15) };
export const ReuiCheckbox16 = { name: 'Nested checkbox group', ...pattern(16) };
export const ReuiCheckbox17 = { name: 'Payment method card checkbox', ...pattern(17) };
export const ReuiCheckbox18 = { name: 'Checkbox with label and tooltip info', ...pattern(18) };
export const ReuiCheckbox19 = { name: 'Checkbox group with badge', ...pattern(19) };
export const ReuiCheckbox20 = { name: 'Checkbox with label and tooltip info', ...pattern(20) };
export const ReuiCheckbox21 = { name: 'Inline horizontal checkbox group', ...pattern(21) };
export const ReuiCheckbox22 = { name: 'Checkbox with feature badge', ...pattern(22) };

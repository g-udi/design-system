// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'radio-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/radio-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/radio-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/RadioGroup', tags: ['autodocs'], ...catalogueMeta('radio-group') };

export const ReuiRadioGroup1 = { name: 'Basic', ...pattern(1) };
export const ReuiRadioGroup2 = { name: 'Disabled', ...pattern(2) };
export const ReuiRadioGroup3 = { name: 'With descriptions', ...pattern(3) };
export const ReuiRadioGroup4 = { name: 'Invalid', ...pattern(4) };
export const ReuiRadioGroup5 = { name: 'Colored', ...pattern(5) };
export const ReuiRadioGroup6 = { name: 'Legend and description', ...pattern(6) };
export const ReuiRadioGroup7 = { name: 'Cards with descriptions', ...pattern(7) };
export const ReuiRadioGroup8 = { name: 'Card with separators', ...pattern(8) };
export const ReuiRadioGroup9 = { name: 'Card with icons', ...pattern(9) };
export const ReuiRadioGroup10 = { name: 'In a frame', ...pattern(10) };
export const ReuiRadioGroup11 = { name: 'Grid layout', ...pattern(11) };
export const ReuiRadioGroup12 = { name: 'Avatar cards', ...pattern(12) };
export const ReuiRadioGroup13 = { name: 'Payment method cards', ...pattern(13) };
export const ReuiRadioGroup14 = { name: 'Tooltip info', ...pattern(14) };
export const ReuiRadioGroup15 = { name: 'With badges', ...pattern(15) };
export const ReuiRadioGroup16 = { name: 'Inline horizontal', ...pattern(16) };
export const ReuiRadioGroup17 = { name: 'Pricing plan cards', ...pattern(17) };

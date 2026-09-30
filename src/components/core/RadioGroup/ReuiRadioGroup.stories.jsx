// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'radio-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/radio-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/radio-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/RadioGroup', tags: ['autodocs'], ...catalogueMeta('radio-group') };

export const ReuiRadioGroup1 = { name: 'Basic radio group', ...pattern(1) };
export const ReuiRadioGroup2 = { name: 'Disabled radio group', ...pattern(2) };
export const ReuiRadioGroup3 = { name: 'Radio with description', ...pattern(3) };
export const ReuiRadioGroup4 = { name: 'Invalid radio group', ...pattern(4) };
export const ReuiRadioGroup5 = { name: 'Colored radio group', ...pattern(5) };
export const ReuiRadioGroup6 = { name: 'Radio group with legend and description', ...pattern(6) };
export const ReuiRadioGroup7 = { name: 'Card radio group with descriptions', ...pattern(7) };
export const ReuiRadioGroup8 = { name: 'Radio group in card with separators', ...pattern(8) };
export const ReuiRadioGroup9 = { name: 'Radio group in card with icons', ...pattern(9) };
export const ReuiRadioGroup10 = { name: 'Radio group in frame', ...pattern(10) };
export const ReuiRadioGroup11 = { name: 'Radio group with grid layout', ...pattern(11) };
export const ReuiRadioGroup12 = { name: 'Avatar based card radio group', ...pattern(12) };
export const ReuiRadioGroup13 = { name: 'Payment method radio cards', ...pattern(13) };
export const ReuiRadioGroup14 = { name: 'Radio group with tooltip info', ...pattern(14) };
export const ReuiRadioGroup15 = { name: 'Radio group with badges', ...pattern(15) };
export const ReuiRadioGroup16 = { name: 'Inline horizontal radio group', ...pattern(16) };
export const ReuiRadioGroup17 = { name: 'Pricing plan radio cards', ...pattern(17) };

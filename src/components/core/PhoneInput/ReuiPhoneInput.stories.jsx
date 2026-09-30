// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'phone-input',
  import.meta.glob('../../../../.storybook/fixtures/reui/phone-input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/phone-input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/PhoneInput', tags: ['autodocs'], ...catalogueMeta('phone-input') };

export const ReuiPhoneInput1 = { name: 'Basic', ...pattern(1) };
export const ReuiPhoneInput2 = { name: 'Small', ...pattern(2) };
export const ReuiPhoneInput3 = { name: 'Large', ...pattern(3) };
export const ReuiPhoneInput4 = { name: 'Disabled', ...pattern(4) };
export const ReuiPhoneInput5 = { name: 'Preset value', ...pattern(5) };
export const ReuiPhoneInput6 = { name: 'Error state', ...pattern(6) };
export const ReuiPhoneInput7 = { name: 'Default country', ...pattern(7) };
export const ReuiPhoneInput8 = { name: 'Read-only', ...pattern(8) };

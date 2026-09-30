// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'input-otp',
  import.meta.glob('../../../../.storybook/fixtures/reui/input-otp/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/input-otp/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/InputOtp', tags: ['autodocs'], ...catalogueMeta('input-otp') };

export const ReuiInputOtp1 = { name: 'Basic OTP input', ...pattern(1) };
export const ReuiInputOtp2 = { name: 'OTP input with numeric digits', ...pattern(2) };
export const ReuiInputOtp3 = { name: 'OTP input with multiple separators', ...pattern(3) };
export const ReuiInputOtp4 = { name: 'OTP input with letters and numbers', ...pattern(4) };
export const ReuiInputOtp5 = { name: 'OTP input for PIN codes', ...pattern(5) };
export const ReuiInputOtp6 = { name: 'OTP input verification code', ...pattern(6) };

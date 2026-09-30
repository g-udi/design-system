// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'field',
  import.meta.glob('../../../../.storybook/fixtures/reui/field/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', tags: ['autodocs'], ...catalogueMeta('field') };

export const ReuiField1 = { name: 'Input groups', ...pattern(1) };
export const ReuiField2 = { name: 'Input and textarea', ...pattern(2) };
export const ReuiField3 = { name: 'Select control', ...pattern(3) };
export const ReuiField4 = { name: 'Radio groups and checkboxes', ...pattern(4) };
export const ReuiField5 = { name: 'Slider and switch', ...pattern(5) };
export const ReuiField6 = { name: 'OTP input', ...pattern(6) };
export const ReuiField7 = { name: 'Settings form with validation', ...pattern(7) };
export const ReuiField8 = { name: 'Permission checkboxes', ...pattern(8) };
export const ReuiField9 = { name: 'Responsive layout', ...pattern(9) };
export const ReuiField10 = { name: 'Notification preferences', ...pattern(10) };
export const ReuiField11 = { name: 'Validation errors', ...pattern(11) };

// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'label',
  import.meta.glob('../../../../.storybook/fixtures/reui/label/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/label/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', tags: ['autodocs'], ...catalogueMeta('label') };

export const ReuiLabel1 = { name: 'Basic label', ...pattern(1) };
export const ReuiLabel2 = { name: 'Label with a checkbox', ...pattern(2) };
export const ReuiLabel3 = { name: 'Label for a textarea', ...pattern(3) };
export const ReuiLabel4 = { name: 'Disabled label', ...pattern(4) };
export const ReuiLabel5 = { name: 'Label with required indicator', ...pattern(5) };
export const ReuiLabel6 = { name: 'Label with optional indicator', ...pattern(6) };
export const ReuiLabel7 = { name: 'Label with info tooltip', ...pattern(7) };
export const ReuiLabel8 = { name: 'Label with badge', ...pattern(8) };
export const ReuiLabel9 = { name: 'Label with character counter', ...pattern(9) };
export const ReuiLabel10 = { name: 'Label with helper text', ...pattern(10) };
export const ReuiLabel11 = { name: 'Label with error state', ...pattern(11) };
export const ReuiLabel12 = { name: 'Label with inline edit', ...pattern(12) };
export const ReuiLabel13 = { name: 'Label with status dot', ...pattern(13) };

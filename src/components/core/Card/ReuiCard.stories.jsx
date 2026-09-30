// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'card',
  import.meta.glob('../../../../.storybook/fixtures/reui/card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Card', tags: ['autodocs'], ...catalogueMeta('card') };

export const ReuiCard1 = { name: 'Basic', ...pattern(1) };
export const ReuiCard2 = { name: 'Header with border', ...pattern(2) };
export const ReuiCard3 = { name: 'Bordered sections', ...pattern(3) };
export const ReuiCard4 = { name: 'Header and footer', ...pattern(4) };
export const ReuiCard5 = { name: 'With link', ...pattern(5) };
export const ReuiCard6 = { name: 'With dropdown menu', ...pattern(6) };
export const ReuiCard7 = { name: 'With image', ...pattern(7) };
export const ReuiCard8 = { name: 'Image zoom on hover', ...pattern(8) };
export const ReuiCard9 = { name: 'Full-bleed image', ...pattern(9) };
export const ReuiCard10 = { name: 'Image with shadow fade', ...pattern(10) };
export const ReuiCard11 = { name: 'Stacked depth', ...pattern(11) };
export const ReuiCard12 = { name: 'Login form', ...pattern(12) };
export const ReuiCard13 = { name: 'Expandable billing usage', ...pattern(13) };
export const ReuiCard14 = { name: 'Deployment status', ...pattern(14) };
export const ReuiCard15 = { name: 'Stat with trend and menu', ...pattern(15) };
export const ReuiCard16 = { name: 'Header badge and actions', ...pattern(16) };
export const ReuiCard17 = { name: 'Icon, title, and link', ...pattern(17) };
export const ReuiCard18 = { name: 'Header label and link', ...pattern(18) };

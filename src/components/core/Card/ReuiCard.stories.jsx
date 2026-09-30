// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'card',
  import.meta.glob('../../../../.storybook/fixtures/reui/card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Card', tags: ['autodocs'], ...catalogueMeta('card') };

export const ReuiCard1 = { name: 'Basic card', ...pattern(1) };
export const ReuiCard2 = { name: 'Card header with border', ...pattern(2) };
export const ReuiCard3 = { name: 'Card with border separation', ...pattern(3) };
export const ReuiCard4 = { name: 'Card with header and footer', ...pattern(4) };
export const ReuiCard5 = { name: 'Card with link', ...pattern(5) };
export const ReuiCard6 = { name: 'Card with dropdown menu', ...pattern(6) };
export const ReuiCard7 = { name: 'Card with image', ...pattern(7) };
export const ReuiCard8 = { name: 'Card with image scale hover effect', ...pattern(8) };
export const ReuiCard9 = { name: 'Card with full image', ...pattern(9) };
export const ReuiCard10 = { name: 'Full card with image and shadow fade effect', ...pattern(10) };
export const ReuiCard11 = { name: 'Card with stacked depth effect', ...pattern(11) };
export const ReuiCard12 = { name: 'Advanced clean login form card', ...pattern(12) };
export const ReuiCard13 = { name: 'Expandable billing usage card', ...pattern(13) };
export const ReuiCard14 = { name: 'Deployment status summary card', ...pattern(14) };
export const ReuiCard15 = { name: 'Stat card with trend and overflow menu', ...pattern(15) };
export const ReuiCard16 = { name: 'Card with header badge and actions', ...pattern(16) };
export const ReuiCard17 = { name: 'Card with icon, title and link', ...pattern(17) };
export const ReuiCard18 = { name: 'Card with header label and link', ...pattern(18) };

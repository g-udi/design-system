// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'frame',
  import.meta.glob('../../../../.storybook/fixtures/reui/frame/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/frame/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Card', tags: ['autodocs'], ...catalogueMeta('frame') };

export const ReuiFrame1 = { name: 'Frame: Basic frame', ...pattern(1) };
export const ReuiFrame2 = { name: 'Frame: Frame with separated panels', ...pattern(2) };
export const ReuiFrame3 = { name: 'Frame: Frame with stacked panels', ...pattern(3) };
export const ReuiFrame4 = { name: 'Frame: Frame with stacked panels and dense style', ...pattern(4) };
export const ReuiFrame5 = { name: 'Frame: Frame with collapsible panels', ...pattern(5) };
export const ReuiFrame6 = { name: 'Frame: Frame with ghost(no outer border) variant', ...pattern(6) };
export const ReuiFrame7 = { name: 'Frame: Frame with dense layout', ...pattern(7) };
export const ReuiFrame8 = { name: 'Frame: Frame with stacked panels', ...pattern(8) };
export const ReuiFrame9 = { name: 'Frame: Frame with extra small spacing', ...pattern(9) };
export const ReuiFrame10 = { name: 'Frame: Frame with small spacing', ...pattern(10) };
export const ReuiFrame11 = { name: 'Frame: Frame with default spacing', ...pattern(11) };
export const ReuiFrame12 = { name: 'Frame: Frame with large spacing', ...pattern(12) };
export const ReuiFrame13 = { name: 'Frame: Frame with small border radius', ...pattern(13) };
export const ReuiFrame14 = { name: 'Frame: Frame with medium border radius', ...pattern(14) };
export const ReuiFrame15 = { name: 'Frame: Frame with large border radius', ...pattern(15) };
export const ReuiFrame16 = { name: 'Frame: Frame with default border radius', ...pattern(16) };
export const ReuiFrame17 = { name: 'Frame: Frame with extra large border radius', ...pattern(17) };
export const ReuiFrame18 = { name: 'Frame: Frame with content-only panels', ...pattern(18) };
export const ReuiFrame19 = { name: 'Frame: Frame with stacked content-only panels', ...pattern(19) };

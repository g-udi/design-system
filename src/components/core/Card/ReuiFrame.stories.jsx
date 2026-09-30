// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'frame',
  import.meta.glob('../../../../.storybook/fixtures/reui/frame/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/frame/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Card', tags: ['autodocs'], ...catalogueMeta('frame') };

export const ReuiFrame1 = { name: 'Frame: Basic', ...pattern(1) };
export const ReuiFrame2 = { name: 'Frame: Separated panels', ...pattern(2) };
export const ReuiFrame3 = { name: 'Frame: Stacked panels', ...pattern(3) };
export const ReuiFrame4 = { name: 'Frame: Dense stacked panels', ...pattern(4) };
export const ReuiFrame5 = { name: 'Frame: Collapsible panels', ...pattern(5) };
export const ReuiFrame6 = { name: 'Frame: Ghost, no outer border', ...pattern(6) };
export const ReuiFrame7 = { name: 'Frame: Dense layout', ...pattern(7) };
export const ReuiFrame8 = { name: 'Frame: Stacked activity log', ...pattern(8) };
export const ReuiFrame9 = { name: 'Frame: Extra small spacing', ...pattern(9) };
export const ReuiFrame10 = { name: 'Frame: Small spacing', ...pattern(10) };
export const ReuiFrame11 = { name: 'Frame: Default spacing', ...pattern(11) };
export const ReuiFrame12 = { name: 'Frame: Large spacing', ...pattern(12) };
export const ReuiFrame13 = { name: 'Frame: Network diagnostics', ...pattern(13) };
export const ReuiFrame14 = { name: 'Frame: Media library', ...pattern(14) };
export const ReuiFrame15 = { name: 'Frame: Team collaboration', ...pattern(15) };
export const ReuiFrame16 = { name: 'Frame: Workspace settings', ...pattern(16) };
export const ReuiFrame17 = { name: 'Frame: Project gallery', ...pattern(17) };
export const ReuiFrame18 = { name: 'Frame: Content-only panels', ...pattern(18) };
export const ReuiFrame19 = { name: 'Frame: Stacked content-only panels', ...pattern(19) };

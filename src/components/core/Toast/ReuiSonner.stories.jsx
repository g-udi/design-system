// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'sonner',
  import.meta.glob('../../../../.storybook/fixtures/reui/sonner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/sonner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Toast', tags: ['autodocs'], ...catalogueMeta('sonner') };

export const ReuiSonner1 = { name: 'Basic toast', ...pattern(1) };
export const ReuiSonner2 = { name: 'With description', ...pattern(2) };
export const ReuiSonner3 = { name: 'Positions', ...pattern(3) };
export const ReuiSonner4 = { name: 'Variants with colored icons', ...pattern(4) };
export const ReuiSonner5 = { name: 'Duration options', ...pattern(5) };
export const ReuiSonner6 = { name: 'Action button', ...pattern(6) };
export const ReuiSonner7 = { name: 'Promise with loading state', ...pattern(7) };
export const ReuiSonner8 = { name: 'Custom close and cancel buttons', ...pattern(8) };
export const ReuiSonner9 = { name: 'Custom rich content', ...pattern(9) };
export const ReuiSonner10 = { name: 'Upload progress', ...pattern(10) };
export const ReuiSonner11 = { name: 'Status alert markup', ...pattern(11) };
export const ReuiSonner12 = { name: 'Accent border', ...pattern(12) };
export const ReuiSonner13 = { name: 'Inverted success', ...pattern(13) };
export const ReuiSonner14 = { name: 'Inverted error with details', ...pattern(14) };
export const ReuiSonner15 = { name: 'Inverted info with avatar', ...pattern(15) };
export const ReuiSonner16 = { name: 'Inverted warning with countdown', ...pattern(16) };
export const ReuiSonner17 = { name: 'Inverted multi-action with avatar group', ...pattern(17) };
export const ReuiSonner18 = { name: 'Close button on top-right', ...pattern(18) };
export const ReuiSonner19 = { name: 'Custom icon', ...pattern(19) };
export const ReuiSonner20 = { name: 'Integration toast', ...pattern(20) };
export const ReuiSonner21 = { name: 'Updatable toast with ID', ...pattern(21) };

// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'sonner',
  import.meta.glob('../../../../.storybook/fixtures/reui/sonner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/sonner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Toast', tags: ['autodocs'], ...catalogueMeta('sonner') };

export const ReuiSonner1 = { name: 'Sonner: Basic toast notification', ...pattern(1) };
export const ReuiSonner2 = { name: 'Sonner: Toast notification with description', ...pattern(2) };
export const ReuiSonner3 = { name: 'Sonner: Toast positions', ...pattern(3) };
export const ReuiSonner4 = { name: 'Sonner: Toast variants with colored icons', ...pattern(4) };
export const ReuiSonner5 = { name: 'Sonner: Toast duration options', ...pattern(5) };
export const ReuiSonner6 = { name: 'Sonner: Toast with action button', ...pattern(6) };
export const ReuiSonner7 = { name: 'Sonner: Promise toast with loading state', ...pattern(7) };
export const ReuiSonner8 = { name: 'Sonner: Toast with custom close and cancel buttons', ...pattern(8) };
export const ReuiSonner9 = { name: 'Sonner: Toast with custom rich content', ...pattern(9) };
export const ReuiSonner10 = { name: 'Sonner: Toast with upload progress simulation', ...pattern(10) };
export const ReuiSonner11 = { name: 'Sonner: Toast with status alert markup', ...pattern(11) };
export const ReuiSonner12 = { name: 'Sonner: Custom accent border toast', ...pattern(12) };
export const ReuiSonner13 = { name: 'Sonner: Custom invert success toast', ...pattern(13) };
export const ReuiSonner14 = { name: 'Sonner: Custom invert error toast with details', ...pattern(14) };
export const ReuiSonner15 = { name: 'Sonner: Custom invert info toast with avatar', ...pattern(15) };
export const ReuiSonner16 = { name: 'Sonner: Custom invert warning toast with countdown', ...pattern(16) };
export const ReuiSonner17 = { name: 'Sonner: Multi-action invert toast with avatar group', ...pattern(17) };
export const ReuiSonner18 = { name: 'Sonner: Toast with close button on top-right', ...pattern(18) };
export const ReuiSonner19 = { name: 'Sonner: Toast with custom icon', ...pattern(19) };
export const ReuiSonner20 = { name: 'Sonner: Custom integration toast', ...pattern(20) };
export const ReuiSonner21 = { name: 'Sonner: Updatable toast with ID', ...pattern(21) };

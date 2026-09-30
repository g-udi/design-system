// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'skeleton',
  import.meta.glob('../../../../.storybook/fixtures/reui/skeleton/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/skeleton/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Skeleton', tags: ['autodocs'], ...catalogueMeta('skeleton') };

export const ReuiSkeleton1 = { name: 'Avatar and user info', ...pattern(1) };
export const ReuiSkeleton2 = { name: 'Card', ...pattern(2) };
export const ReuiSkeleton3 = { name: 'Text and paragraphs', ...pattern(3) };
export const ReuiSkeleton4 = { name: 'Form', ...pattern(4) };
export const ReuiSkeleton5 = { name: 'Data table', ...pattern(5) };
export const ReuiSkeleton6 = { name: 'Dashboard stats row', ...pattern(6) };
export const ReuiSkeleton7 = { name: 'List with actions', ...pattern(7) };
export const ReuiSkeleton8 = { name: 'Card grid', ...pattern(8) };
export const ReuiSkeleton9 = { name: 'Profile page', ...pattern(9) };
export const ReuiSkeleton10 = { name: 'Chat messages', ...pattern(10) };

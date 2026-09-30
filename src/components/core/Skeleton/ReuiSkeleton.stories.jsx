// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'skeleton',
  import.meta.glob('../../../../.storybook/fixtures/reui/skeleton/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/skeleton/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Skeleton', tags: ['autodocs'], ...catalogueMeta('skeleton') };

export const ReuiSkeleton1 = { name: 'Skeleton loader for avatars and user info', ...pattern(1) };
export const ReuiSkeleton2 = { name: 'Skeleton loader for a card component', ...pattern(2) };
export const ReuiSkeleton3 = { name: 'Skeleton loader for text and paragraphs', ...pattern(3) };
export const ReuiSkeleton4 = { name: 'Skeleton loader for a form', ...pattern(4) };
export const ReuiSkeleton5 = { name: 'Skeleton loader for a data table', ...pattern(5) };
export const ReuiSkeleton6 = { name: 'Skeleton loader for a dashboard stats row', ...pattern(6) };
export const ReuiSkeleton7 = { name: 'Skeleton loader for a list with actions', ...pattern(7) };
export const ReuiSkeleton8 = { name: 'Skeleton loader for a card grid', ...pattern(8) };
export const ReuiSkeleton9 = { name: 'Skeleton loader for a full profile page', ...pattern(9) };
export const ReuiSkeleton10 = { name: 'Skeleton loader for chat messages', ...pattern(10) };

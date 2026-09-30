import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'skeleton',
  import.meta.glob('../../../../.storybook/fixtures/patterns/skeleton/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/skeleton/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Skeleton', id: 'core-skeleton', tags: ['autodocs'], ...catalogueMeta('skeleton') };

export const SkeletonPattern7 = { name: 'List with avatars and actions', ...pattern(7) };
export const SkeletonPattern8 = { name: 'Media card', ...pattern(8) };
export const SkeletonPattern6 = { name: 'Dashboard stats and table', ...pattern(6) };
export const SkeletonPattern4 = { name: 'Form', ...pattern(4) };
export const SkeletonPattern9 = { name: 'Profile page', ...pattern(9) };
export const SkeletonPattern10 = { name: 'Chat messages', ...pattern(10) };

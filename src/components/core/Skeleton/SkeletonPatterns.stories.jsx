import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'skeleton',
  import.meta.glob('../../../../.storybook/fixtures/patterns/skeleton/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/skeleton/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Skeleton', tags: ['autodocs'], ...catalogueMeta('skeleton') };

export const SkeletonPattern1 = { name: 'Avatar and user info', ...pattern(1) };
export const SkeletonPattern2 = { name: 'Card', ...pattern(2) };
export const SkeletonPattern3 = { name: 'Text and paragraphs', ...pattern(3) };
export const SkeletonPattern4 = { name: 'Form', ...pattern(4) };
export const SkeletonPattern5 = { name: 'Data table', ...pattern(5) };
export const SkeletonPattern6 = { name: 'Dashboard stats row', ...pattern(6) };
export const SkeletonPattern7 = { name: 'List with actions', ...pattern(7) };
export const SkeletonPattern8 = { name: 'Card grid', ...pattern(8) };
export const SkeletonPattern9 = { name: 'Profile page', ...pattern(9) };
export const SkeletonPattern10 = { name: 'Chat messages', ...pattern(10) };

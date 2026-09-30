import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'timeline',
  import.meta.glob('../../../../.storybook/fixtures/patterns/timeline/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

export const TimelinePattern1 = { name: 'Basic timeline', ...pattern(1) };
export const TimelinePattern2 = { name: 'Roadmap', ...pattern(2) };
export const TimelinePattern3 = { name: 'Order status', ...pattern(3) };
export const TimelinePattern4 = { name: 'Git activity', ...pattern(4) };
export const TimelinePattern5 = { name: 'Milestones', ...pattern(5) };
export const TimelinePattern6 = { name: 'Pipeline steps', ...pattern(6) };
export const TimelinePattern7 = { name: 'Roadmap items', ...pattern(7) };
export const TimelinePattern8 = { name: 'Vertical timeline', ...pattern(8) };
export const TimelinePattern9 = { name: 'Horizontal with leading labels', ...pattern(9) };
export const TimelinePattern10 = { name: 'Deployment log', ...pattern(10) };
export const TimelinePattern11 = { name: 'Activity feed with avatars', ...pattern(11) };
export const TimelinePattern12 = { name: 'Compact horizontal milestones', ...pattern(12) };

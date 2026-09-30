// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'timeline',
  import.meta.glob('../../../../.storybook/fixtures/reui/timeline/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

export const ReuiTimeline1 = { name: 'Basic timeline', ...pattern(1) };
export const ReuiTimeline2 = { name: 'Roadmap', ...pattern(2) };
export const ReuiTimeline3 = { name: 'Order status', ...pattern(3) };
export const ReuiTimeline4 = { name: 'Git activity', ...pattern(4) };
export const ReuiTimeline5 = { name: 'Milestones', ...pattern(5) };
export const ReuiTimeline6 = { name: 'Pipeline steps', ...pattern(6) };
export const ReuiTimeline7 = { name: 'Roadmap items', ...pattern(7) };
export const ReuiTimeline8 = { name: 'Vertical timeline', ...pattern(8) };
export const ReuiTimeline9 = { name: 'Horizontal with leading labels', ...pattern(9) };
export const ReuiTimeline10 = { name: 'Deployment log', ...pattern(10) };
export const ReuiTimeline11 = { name: 'Activity feed with avatars', ...pattern(11) };
export const ReuiTimeline12 = { name: 'Compact horizontal milestones', ...pattern(12) };

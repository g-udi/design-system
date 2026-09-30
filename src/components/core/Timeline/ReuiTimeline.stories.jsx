// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'timeline',
  import.meta.glob('../../../../.storybook/fixtures/reui/timeline/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

export const ReuiTimeline1 = { name: 'Basic timeline', ...pattern(1) };
export const ReuiTimeline2 = { name: 'Timeline with roadmap', ...pattern(2) };
export const ReuiTimeline3 = { name: 'Timeline with order status', ...pattern(3) };
export const ReuiTimeline4 = { name: 'Timeline with git activity', ...pattern(4) };
export const ReuiTimeline5 = { name: 'Timeline with milestones', ...pattern(5) };
export const ReuiTimeline6 = { name: 'Timeline with pipeline steps', ...pattern(6) };
export const ReuiTimeline7 = { name: 'Timeline with roadmap items', ...pattern(7) };
export const ReuiTimeline8 = { name: 'Vertical timeline', ...pattern(8) };
export const ReuiTimeline9 = { name: 'Horizontal timeline with leading labels', ...pattern(9) };
export const ReuiTimeline10 = { name: 'Deployment log timeline', ...pattern(10) };
export const ReuiTimeline11 = { name: 'Activity feed timeline with user avatars', ...pattern(11) };
export const ReuiTimeline12 = { name: 'Compact horizontal milestone timeline', ...pattern(12) };

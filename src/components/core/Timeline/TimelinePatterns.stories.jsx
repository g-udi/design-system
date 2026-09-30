import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'timeline',
  import.meta.glob('../../../../.storybook/fixtures/patterns/timeline/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/Timeline', id: 'core-timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

export const TimelinePattern3 = { name: 'Vertical progress', ...pattern(3, 'Switch the indicator between a dot, a check and an icon, move dates into a leading column, or hide descriptions for a compact log.') };
export const TimelinePattern12 = { name: 'Horizontal releases', ...pattern(12, 'Status indicators and a current badge on a horizontal rail, with dates below or above it.') };
export const TimelinePattern11 = { name: 'Activity feed with avatars', ...pattern(11, 'Avatars replace the indicator; deploy events carry a status badge.') };
export const TimelinePattern6 = { name: 'Pipeline steps', ...pattern(6, 'Each step shows its status and duration and folds its details into a collapsible panel.') };
export const TimelinePattern5 = { name: 'Alternating milestones', ...pattern(5) };

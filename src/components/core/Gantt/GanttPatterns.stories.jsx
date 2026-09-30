import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'gantt',
  import.meta.glob('../../../../.storybook/fixtures/patterns/gantt/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/gantt/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Gantt', tags: ['autodocs'], ...catalogueMeta('gantt') };

export const GanttPattern1 = { name: 'Settings menu and schedulable rows', ...pattern(1) };
export const GanttPattern2 = { name: 'Drag-to-reorder tree rows', ...pattern(2) };
export const GanttPattern3 = { name: 'Quarter roadmap with rollups', ...pattern(3) };
export const GanttPattern4 = { name: 'Weekly capacity board', ...pattern(4) };
export const GanttPattern5 = { name: 'Task table with progress', ...pattern(5) };
export const GanttPattern6 = { name: 'Baseline tracking', ...pattern(6) };
export const GanttPattern7 = { name: 'Dependencies and milestones', ...pattern(7) };

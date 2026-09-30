import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'gantt',
  import.meta.glob('../../../../.storybook/fixtures/patterns/gantt/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/gantt/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Gantt', tags: ['autodocs'], ...catalogueMeta('gantt') };

export const GanttPattern1 = { name: 'Settings menu, row reordering and scheduling', ...pattern(1, 'A settings menu toggles every display and interaction flag, row handles drag to reorder the tree, and empty rows schedule by drag or click.') };
export const GanttPattern5 = { name: 'Task table with progress', ...pattern(5) };
export const GanttPattern3 = { name: 'Quarter roadmap with rollups', ...pattern(3) };
export const GanttPattern4 = { name: 'Weekly capacity board', ...pattern(4) };
export const GanttPattern6 = { name: 'Baseline, dependencies and milestones', ...pattern(6, 'Planned windows ghost behind actual bars, finish-to-start arrows link each task to its predecessors, and a zero-length milestone renders as a diamond.') };

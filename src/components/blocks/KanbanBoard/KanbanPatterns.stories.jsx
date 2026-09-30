import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kanban',
  import.meta.glob('../../../../.storybook/fixtures/patterns/kanban/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/kanban/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Application/KanbanBoard', tags: ['autodocs'], ...catalogueMeta('kanban') };

export const KanbanPattern1 = { name: 'Placeholder drag overlay', ...pattern(1) };
export const KanbanPattern2 = { name: 'Dynamic drag overlay', ...pattern(2) };
export const KanbanPattern3 = { name: 'Framed columns', ...pattern(3) };
export const KanbanPattern4 = { name: 'Minimal stacked frame', ...pattern(4) };
export const KanbanPattern5 = { name: 'Roadmap with progress', ...pattern(5) };
export const KanbanPattern6 = { name: 'Persisted to a backend', ...pattern(6, 'Persist moves with onValueCommit, optimistic updates, and a Sonner rollback.') };

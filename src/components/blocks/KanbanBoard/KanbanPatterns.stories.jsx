import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kanban',
  import.meta.glob('../../../../.storybook/fixtures/patterns/kanban/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/kanban/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/To Sort/KanbanBoard', id: 'blocks-application-kanbanboard', tags: ['autodocs'], ...catalogueMeta('kanban') };

export const KanbanPattern1 = { name: 'Board options', ...pattern(1, 'Drag cards and columns, with the column frame switched between plain, framed and stacked, and the drag overlay between a dashed placeholder and a live copy.') };
export const KanbanPattern6 = { name: 'Persisted to a backend', ...pattern(6, 'Persist moves with onValueCommit, optimistic updates, and a toast rollback.') };

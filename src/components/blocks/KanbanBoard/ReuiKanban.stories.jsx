// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'kanban',
  import.meta.glob('../../../../.storybook/fixtures/reui/kanban/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/kanban/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/KanbanBoard', tags: ['autodocs'], ...catalogueMeta('kanban') };

export const ReuiKanban1 = { name: 'Kanban: Kanban board with placeholder overlay', ...pattern(1) };
export const ReuiKanban2 = { name: 'Kanban: Kanban board with dynamic overlay', ...pattern(2) };
export const ReuiKanban3 = { name: 'Kanban: Kanban board with frame columns', ...pattern(3) };
export const ReuiKanban4 = { name: 'Kanban: Minimal kanban with stacked frame', ...pattern(4) };
export const ReuiKanban5 = { name: 'Kanban: Feature roadmap kanban with progress', ...pattern(5) };
export const ReuiKanban6 = { name: 'Kanban: Kanban board persisted to a backend', ...pattern(6, 'Persist moves with onValueCommit, optimistic updates, and Sonner rollback') };

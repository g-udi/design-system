// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'kanban',
  import.meta.glob('../../../../.storybook/fixtures/reui/kanban/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/kanban/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Application/KanbanBoard', tags: ['autodocs'], ...catalogueMeta('kanban') };

export const ReuiKanban1 = { name: 'Placeholder drag overlay', ...pattern(1) };
export const ReuiKanban2 = { name: 'Dynamic drag overlay', ...pattern(2) };
export const ReuiKanban3 = { name: 'Framed columns', ...pattern(3) };
export const ReuiKanban4 = { name: 'Minimal stacked frame', ...pattern(4) };
export const ReuiKanban5 = { name: 'Roadmap with progress', ...pattern(5) };
export const ReuiKanban6 = { name: 'Persisted to a backend', ...pattern(6, 'Persist moves with onValueCommit, optimistic updates, and a Sonner rollback.') };

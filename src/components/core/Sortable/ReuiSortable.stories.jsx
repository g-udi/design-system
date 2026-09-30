// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'sortable',
  import.meta.glob('../../../../.storybook/fixtures/reui/sortable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/sortable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Sortable', tags: ['autodocs'], ...catalogueMeta('sortable') };

export const ReuiSortable1 = {
  name: 'Sortable list of items with drag-and-drop',
  ...pattern(1),
  play: catalogueInteractions['sortable-1']
};
export const ReuiSortable2 = { name: 'Sortable list of items with grid layout', ...pattern(2) };
export const ReuiSortable3 = { name: 'Sortable list of items with nested layout', ...pattern(3) };
export const ReuiSortable4 = { name: 'Sortable playlist with frame', ...pattern(4) };
export const ReuiSortable5 = { name: 'Sortable settings priority with frame', ...pattern(5) };
export const ReuiSortable6 = { name: 'Sortable sidebar navigation with frame', ...pattern(6) };
export const ReuiSortable7 = { name: 'Sortable image gallery grid with frame', ...pattern(7) };
export const ReuiSortable8 = { name: 'Sortable list persisted to a backend', ...pattern(8, 'Persist the new order with onValueCommit, optimistic updates, and Sonner rollback') };

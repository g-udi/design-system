// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'sortable',
  import.meta.glob('../../../../.storybook/fixtures/reui/sortable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/sortable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Sortable', tags: ['autodocs'], ...catalogueMeta('sortable') };

export const ReuiSortable1 = { name: 'File list', ...pattern(1), play: catalogueInteractions['sortable-1'] };
export const ReuiSortable2 = { name: 'Grid', ...pattern(2) };
export const ReuiSortable3 = { name: 'Nested lists', ...pattern(3, 'Groups and the values inside each group reorder independently.') };
export const ReuiSortable4 = { name: 'Playlist', ...pattern(4) };
export const ReuiSortable5 = { name: 'Settings priority', ...pattern(5) };
export const ReuiSortable6 = { name: 'Sidebar navigation', ...pattern(6) };
export const ReuiSortable7 = { name: 'Image gallery', ...pattern(7) };
export const ReuiSortable8 = { name: 'Persisted order', ...pattern(8, 'Persist the new order with `onValueCommit`, update optimistically, and roll back with a toast on failure.') };

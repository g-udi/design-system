import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'sortable',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sortable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sortable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Sortable', tags: ['autodocs'], ...catalogueMeta('sortable') };

export const SortablePattern1 = { name: 'File list', ...pattern(1), play: catalogueInteractions['sortable-1'] };
export const SortablePattern2 = { name: 'Grid', ...pattern(2) };
export const SortablePattern3 = { name: 'Nested lists', ...pattern(3, 'Groups and the values inside each group reorder independently.') };
export const SortablePattern4 = { name: 'Playlist', ...pattern(4) };
export const SortablePattern5 = { name: 'Settings priority', ...pattern(5) };
export const SortablePattern6 = { name: 'Sidebar navigation', ...pattern(6) };
export const SortablePattern7 = { name: 'Image gallery', ...pattern(7) };
export const SortablePattern8 = { name: 'Persisted order', ...pattern(8, 'Persist the new order with `onValueCommit`, update optimistically, and roll back with a toast on failure.') };

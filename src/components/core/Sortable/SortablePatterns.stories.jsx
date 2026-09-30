import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'sortable',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sortable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sortable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Sortable', id: 'core-sortable', tags: ['autodocs'], ...catalogueMeta('sortable') };

export const SortablePattern1 = { name: 'List with row controls', ...pattern(1, 'Rows reorder by their handle while the switch in each row stays clickable; the first row becomes the cover.'), play: catalogueInteractions['sortable-1'] };
export const SortablePattern2 = { name: 'Media grid', ...pattern(2, 'The grid strategy with a featured tile spanning two cells and handles that appear on hover.') };
export const SortablePattern3 = { name: 'Nested lists', ...pattern(3, 'Groups and the values inside each group reorder independently.') };
export const SortablePattern8 = { name: 'Persisted order', ...pattern(8, 'Persist the new order with `onValueCommit`, update optimistically, and roll back with a toast on failure.') };

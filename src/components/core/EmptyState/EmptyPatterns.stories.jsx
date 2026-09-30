import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'empty',
  import.meta.glob('../../../../.storybook/fixtures/patterns/empty/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/empty/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/EmptyState', tags: ['autodocs'], ...catalogueMeta('empty') };

export const EmptyPattern1 = { name: 'Basic empty state', ...pattern(1) };
export const EmptyPattern2 = { name: 'No search results', ...pattern(2) };
export const EmptyPattern3 = { name: 'With search input', ...pattern(3) };
export const EmptyPattern4 = { name: 'With add button', ...pattern(4) };
export const EmptyPattern5 = { name: 'Documents', ...pattern(5) };
export const EmptyPattern6 = { name: 'Dashed upload area', ...pattern(6) };
export const EmptyPattern7 = { name: 'Inbox', ...pattern(7) };
export const EmptyPattern8 = { name: 'Team members', ...pattern(8) };
export const EmptyPattern9 = { name: 'No notifications', ...pattern(9) };
export const EmptyPattern10 = { name: 'No analytics data', ...pattern(10) };
export const EmptyPattern11 = { name: 'Bookmarks', ...pattern(11) };
export const EmptyPattern12 = { name: 'Tasks', ...pattern(12) };
export const EmptyPattern13 = { name: 'No automations with toggle illustration', ...pattern(13) };
export const EmptyPattern14 = { name: 'Comments with board illustration', ...pattern(14) };
export const EmptyPattern15 = { name: 'No products with stacked cards', ...pattern(15) };
export const EmptyPattern16 = { name: 'Search with file cards illustration', ...pattern(16) };
export const EmptyPattern17 = { name: 'No messages with chat bubbles', ...pattern(17) };
export const EmptyPattern18 = { name: 'No payments with card illustration', ...pattern(18) };
export const EmptyPattern19 = { name: 'No integrations with connected nodes', ...pattern(19) };
export const EmptyPattern20 = { name: 'No events with calendar illustration', ...pattern(20) };

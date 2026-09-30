// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'empty',
  import.meta.glob('../../../../.storybook/fixtures/reui/empty/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/empty/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/EmptyState', tags: ['autodocs'], ...catalogueMeta('empty') };

export const ReuiEmpty1 = { name: 'Basic empty state', ...pattern(1) };
export const ReuiEmpty2 = { name: 'No search results', ...pattern(2) };
export const ReuiEmpty3 = { name: 'With search input', ...pattern(3) };
export const ReuiEmpty4 = { name: 'With add button', ...pattern(4) };
export const ReuiEmpty5 = { name: 'Documents', ...pattern(5) };
export const ReuiEmpty6 = { name: 'Dashed upload area', ...pattern(6) };
export const ReuiEmpty7 = { name: 'Inbox', ...pattern(7) };
export const ReuiEmpty8 = { name: 'Team members', ...pattern(8) };
export const ReuiEmpty9 = { name: 'No notifications', ...pattern(9) };
export const ReuiEmpty10 = { name: 'No analytics data', ...pattern(10) };
export const ReuiEmpty11 = { name: 'Bookmarks', ...pattern(11) };
export const ReuiEmpty12 = { name: 'Tasks', ...pattern(12) };
export const ReuiEmpty13 = { name: 'No automations with toggle illustration', ...pattern(13) };
export const ReuiEmpty14 = { name: 'Comments with board illustration', ...pattern(14) };
export const ReuiEmpty15 = { name: 'No products with stacked cards', ...pattern(15) };
export const ReuiEmpty16 = { name: 'Search with file cards illustration', ...pattern(16) };
export const ReuiEmpty17 = { name: 'No messages with chat bubbles', ...pattern(17) };
export const ReuiEmpty18 = { name: 'No payments with card illustration', ...pattern(18) };
export const ReuiEmpty19 = { name: 'No integrations with connected nodes', ...pattern(19) };
export const ReuiEmpty20 = { name: 'No events with calendar illustration', ...pattern(20) };

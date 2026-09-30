// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'empty',
  import.meta.glob('../../../../.storybook/fixtures/reui/empty/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/empty/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/EmptyState', tags: ['autodocs'], ...catalogueMeta('empty') };

export const ReuiEmpty1 = { name: 'Empty: Basic empty state', ...pattern(1) };
export const ReuiEmpty2 = { name: 'Empty: Search empty state', ...pattern(2) };
export const ReuiEmpty3 = { name: 'Empty: Empty state with search input', ...pattern(3) };
export const ReuiEmpty4 = { name: 'Empty: Empty state with add button', ...pattern(4) };
export const ReuiEmpty5 = { name: 'Empty: Document empty state', ...pattern(5) };
export const ReuiEmpty6 = { name: 'Empty: Dashed upload empty state', ...pattern(6) };
export const ReuiEmpty7 = { name: 'Empty: Inbox empty state', ...pattern(7) };
export const ReuiEmpty8 = { name: 'Empty: Team members empty state', ...pattern(8) };
export const ReuiEmpty9 = { name: 'Empty: No notifications empty state', ...pattern(9) };
export const ReuiEmpty10 = { name: 'Empty: No data analytics empty state', ...pattern(10) };
export const ReuiEmpty11 = { name: 'Empty: Bookmarks empty state', ...pattern(11) };
export const ReuiEmpty12 = { name: 'Empty: Tasks empty state', ...pattern(12) };
export const ReuiEmpty13 = { name: 'Empty: No automations empty state with toggle illustration', ...pattern(13) };
export const ReuiEmpty14 = { name: 'Empty: Comments empty state with isometric board illustration', ...pattern(14) };
export const ReuiEmpty15 = { name: 'Empty: No products empty state with stacked cards and blur effect', ...pattern(15) };
export const ReuiEmpty16 = { name: 'Empty: Search empty state with stacked file cards illustration', ...pattern(16) };
export const ReuiEmpty17 = { name: 'Empty: No messages empty state with chat bubbles illustration', ...pattern(17) };
export const ReuiEmpty18 = { name: 'Empty: No payments empty state with credit card illustration', ...pattern(18) };
export const ReuiEmpty19 = { name: 'Empty: No integrations empty state with connected nodes illustration', ...pattern(19) };
export const ReuiEmpty20 = { name: 'Empty: No events empty state with calendar illustration', ...pattern(20) };

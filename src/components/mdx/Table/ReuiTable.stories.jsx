// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'table',
  import.meta.glob('../../../../.storybook/fixtures/reui/table/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/table/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Table', tags: ['autodocs'], ...catalogueMeta('table') };

export const ReuiTable1 = { name: 'Basic table', ...pattern(1) };
export const ReuiTable2 = { name: 'Table with footer', ...pattern(2) };
export const ReuiTable3 = { name: 'Table in card with status badges', ...pattern(3) };
export const ReuiTable4 = { name: 'Table card with actions column', ...pattern(4) };
export const ReuiTable5 = { name: 'Table with interactive elements', ...pattern(5) };
export const ReuiTable6 = { name: 'Team members table with avatars, roles, and status', ...pattern(6) };
export const ReuiTable7 = { name: 'Orders table with customer info and payment status', ...pattern(7) };
export const ReuiTable8 = { name: 'Projects table with team avatars and status', ...pattern(8) };
export const ReuiTable9 = { name: 'Activity log table with user avatars and timestamps', ...pattern(9) };
export const ReuiTable10 = { name: 'Subscriptions table with plan badges and billing info', ...pattern(10) };
export const ReuiTable11 = { name: 'Product inventory table with stock badges and prices', ...pattern(11) };
export const ReuiTable12 = { name: 'API keys table with permission badges and actions', ...pattern(12) };
export const ReuiTable13 = { name: 'File manager table with owners and sharing badges', ...pattern(13) };
export const ReuiTable14 = { name: 'Issues table with priority, assignee, and labels', ...pattern(14) };
export const ReuiTable15 = { name: 'Leaderboard table with rank, score, and level badges', ...pattern(15) };
export const ReuiTable16 = { name: 'Vertical table with employee profile details', ...pattern(16) };
export const ReuiTable17 = { name: 'Vertical table with server configuration details', ...pattern(17) };

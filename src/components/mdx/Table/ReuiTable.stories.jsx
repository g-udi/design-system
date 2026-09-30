// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'table',
  import.meta.glob('../../../../.storybook/fixtures/reui/table/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/table/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Table', tags: ['autodocs'], ...catalogueMeta('table') };

export const ReuiTable1 = { name: 'Basic table', ...pattern(1) };
export const ReuiTable2 = { name: 'With footer', ...pattern(2) };
export const ReuiTable3 = { name: 'Card with status badges', ...pattern(3) };
export const ReuiTable4 = { name: 'Card with actions column', ...pattern(4) };
export const ReuiTable5 = { name: 'Interactive elements', ...pattern(5) };
export const ReuiTable6 = { name: 'Team members', ...pattern(6) };
export const ReuiTable7 = { name: 'Orders and payment status', ...pattern(7) };
export const ReuiTable8 = { name: 'Projects with team avatars', ...pattern(8) };
export const ReuiTable9 = { name: 'Activity log', ...pattern(9) };
export const ReuiTable10 = { name: 'Subscriptions and billing', ...pattern(10) };
export const ReuiTable11 = { name: 'Product inventory', ...pattern(11) };
export const ReuiTable12 = { name: 'API keys and permissions', ...pattern(12) };
export const ReuiTable13 = { name: 'File manager', ...pattern(13) };
export const ReuiTable14 = { name: 'Issue tracker', ...pattern(14) };
export const ReuiTable15 = { name: 'Leaderboard', ...pattern(15) };
export const ReuiTable16 = { name: 'Vertical profile details', ...pattern(16) };
export const ReuiTable17 = { name: 'Vertical server configuration', ...pattern(17) };

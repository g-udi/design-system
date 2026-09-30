import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'table',
  import.meta.glob('../../../../.storybook/fixtures/patterns/table/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/table/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Table', tags: ['autodocs'], ...catalogueMeta('table') };

export const TablePattern1 = { name: 'Basic table', ...pattern(1) };
export const TablePattern2 = { name: 'With footer', ...pattern(2) };
export const TablePattern3 = { name: 'Card with status badges', ...pattern(3) };
export const TablePattern4 = { name: 'Card with actions column', ...pattern(4) };
export const TablePattern5 = { name: 'Interactive elements', ...pattern(5) };
export const TablePattern6 = { name: 'Team members', ...pattern(6) };
export const TablePattern7 = { name: 'Orders and payment status', ...pattern(7) };
export const TablePattern8 = { name: 'Projects with team avatars', ...pattern(8) };
export const TablePattern9 = { name: 'Activity log', ...pattern(9) };
export const TablePattern10 = { name: 'Subscriptions and billing', ...pattern(10) };
export const TablePattern11 = { name: 'Product inventory', ...pattern(11) };
export const TablePattern12 = { name: 'API keys and permissions', ...pattern(12) };
export const TablePattern13 = { name: 'File manager', ...pattern(13) };
export const TablePattern14 = { name: 'Issue tracker', ...pattern(14) };
export const TablePattern15 = { name: 'Leaderboard', ...pattern(15) };
export const TablePattern16 = { name: 'Vertical profile details', ...pattern(16) };
export const TablePattern17 = { name: 'Vertical server configuration', ...pattern(17) };

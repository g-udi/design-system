// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'item',
  import.meta.glob('../../../../.storybook/fixtures/reui/item/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/item/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/ResourceList', tags: ['autodocs'], ...catalogueMeta('item') };

export const ReuiItem1 = { name: 'Title and description', ...pattern(1) };
export const ReuiItem2 = { name: 'Icon media and actions', ...pattern(2) };
export const ReuiItem3 = { name: 'User with follow button', ...pattern(3) };
export const ReuiItem4 = { name: 'Navigation rows', ...pattern(4) };
export const ReuiItem5 = { name: 'Status badges', ...pattern(5) };
export const ReuiItem6 = { name: 'Files with size and actions', ...pattern(6) };
export const ReuiItem7 = { name: 'Keyboard shortcuts', ...pattern(7) };
export const ReuiItem8 = { name: 'Small size with badges', ...pattern(8) };
export const ReuiItem9 = { name: 'Team members and roles', ...pattern(9) };
export const ReuiItem10 = { name: 'Header and footer', ...pattern(10) };
export const ReuiItem11 = { name: 'Integrations with connect actions', ...pattern(11) };
export const ReuiItem12 = { name: 'Activity feed', ...pattern(12) };

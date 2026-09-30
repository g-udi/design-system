// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'item',
  import.meta.glob('../../../../.storybook/fixtures/reui/item/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/item/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/ResourceList', tags: ['autodocs'], ...catalogueMeta('item') };

export const ReuiItem1 = { name: 'Item: Basic item with title and description', ...pattern(1) };
export const ReuiItem2 = { name: 'Item: Items with icon media and action buttons', ...pattern(2) };
export const ReuiItem3 = { name: 'Item: User item with avatar, info, and follow button', ...pattern(3) };
export const ReuiItem4 = { name: 'Item: Clickable navigation items with icons and chevron', ...pattern(4) };
export const ReuiItem5 = { name: 'Item: Item group with status badges', ...pattern(5) };
export const ReuiItem6 = { name: 'Item: File items with icon media, size, and actions', ...pattern(6) };
export const ReuiItem7 = { name: 'Item: Items with keyboard shortcuts', ...pattern(7) };
export const ReuiItem8 = { name: 'Item: Small-size items with badges', ...pattern(8) };
export const ReuiItem9 = { name: 'Item: Team members with roles and multiple actions', ...pattern(9) };
export const ReuiItem10 = { name: 'Item: Item with header and footer sections', ...pattern(10) };
export const ReuiItem11 = { name: 'Item: Integration items with connect actions', ...pattern(11) };
export const ReuiItem12 = { name: 'Item: Activity feed items with avatars and actions', ...pattern(12) };

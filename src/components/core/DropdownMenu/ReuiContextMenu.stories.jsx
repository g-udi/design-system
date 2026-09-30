// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'context-menu',
  import.meta.glob('../../../../.storybook/fixtures/reui/context-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/context-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('context-menu') };

export const ReuiContextMenu1 = { name: 'Basic context menu', ...pattern(1) };
export const ReuiContextMenu2 = { name: 'Context menu with icons', ...pattern(2) };
export const ReuiContextMenu3 = { name: 'Context menu with shortcuts', ...pattern(3) };
export const ReuiContextMenu4 = { name: 'Context menu with submenus', ...pattern(4) };
export const ReuiContextMenu5 = { name: 'Context menu labels and separators', ...pattern(5) };
export const ReuiContextMenu6 = { name: 'Context menu with checkboxes', ...pattern(6) };
export const ReuiContextMenu7 = { name: 'Context menu with radio items', ...pattern(7) };
export const ReuiContextMenu8 = { name: 'Context menu with destructive actions', ...pattern(8) };
export const ReuiContextMenu9 = { name: 'Context menu alignment', ...pattern(9) };
export const ReuiContextMenu10 = { name: 'Context menu inside a dialog', ...pattern(10) };

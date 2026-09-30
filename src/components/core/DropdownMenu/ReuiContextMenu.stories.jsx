// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'context-menu',
  import.meta.glob('../../../../.storybook/fixtures/reui/context-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/context-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('context-menu') };

export const ReuiContextMenu1 = { name: 'Context Menu: Basic context menu', ...pattern(1) };
export const ReuiContextMenu2 = { name: 'Context Menu: Context menu with icons for common actions', ...pattern(2) };
export const ReuiContextMenu3 = { name: 'Context Menu: Context menu with keyboard shortcuts', ...pattern(3) };
export const ReuiContextMenu4 = { name: 'Context Menu: Context menu with nested submenus', ...pattern(4) };
export const ReuiContextMenu5 = { name: 'Context Menu: Context menu labels and separators', ...pattern(5) };
export const ReuiContextMenu6 = { name: 'Context Menu: Context menu with checkbox items', ...pattern(6) };
export const ReuiContextMenu7 = { name: 'Context Menu: Context menu with radio items', ...pattern(7) };
export const ReuiContextMenu8 = { name: 'Context Menu: Context menu with destructive actions', ...pattern(8) };
export const ReuiContextMenu9 = { name: 'Context Menu: Context menu with different alignment sides', ...pattern(9) };
export const ReuiContextMenu10 = { name: 'Context Menu: Context menu used inside a dialog component', ...pattern(10) };

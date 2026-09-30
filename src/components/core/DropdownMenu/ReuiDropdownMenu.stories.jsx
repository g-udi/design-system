// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'dropdown-menu',
  import.meta.glob('../../../../.storybook/fixtures/reui/dropdown-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/dropdown-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('dropdown-menu') };

export const ReuiDropdownMenu1 = { name: 'Basic dropdown menu', ...pattern(1) };
export const ReuiDropdownMenu2 = { name: 'Dropdown menus opening positions', ...pattern(2) };
export const ReuiDropdownMenu3 = { name: 'Dropdown menu with icons', ...pattern(3) };
export const ReuiDropdownMenu4 = { name: 'Dropdown menu with keyboard shortcuts', ...pattern(4) };
export const ReuiDropdownMenu5 = { name: 'Dropdown menu with nested submenus', ...pattern(5) };
export const ReuiDropdownMenu6 = { name: 'Dropdown menu with checkboxes', ...pattern(6) };
export const ReuiDropdownMenu7 = { name: 'Dropdown menu with radio groups', ...pattern(7) };
export const ReuiDropdownMenu8 = { name: 'Advance dropdown menu', ...pattern(8) };
export const ReuiDropdownMenu9 = { name: 'User profile dropdown menu', ...pattern(9) };
export const ReuiDropdownMenu10 = { name: 'Workspace switcher dropdown menu', ...pattern(10) };
export const ReuiDropdownMenu11 = { name: 'Notifications dropdown menu', ...pattern(11) };
export const ReuiDropdownMenu12 = { name: 'Actions dropdown menu', ...pattern(12) };
export const ReuiDropdownMenu13 = { name: 'Share and export dropdown menu', ...pattern(13) };
export const ReuiDropdownMenu14 = { name: 'User profile dropdown menu with theme toggle and status selector', ...pattern(14) };
export const ReuiDropdownMenu15 = { name: 'User and create menu', ...pattern(15) };
export const ReuiDropdownMenu16 = { name: 'Quick action menu', ...pattern(16) };
export const ReuiDropdownMenu17 = { name: 'Notifications dropdown with items', ...pattern(17) };
export const ReuiDropdownMenu18 = { name: 'AI model selector with provider icons', ...pattern(18) };

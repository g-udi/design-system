// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'dropdown-menu',
  import.meta.glob('../../../../.storybook/fixtures/reui/dropdown-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/dropdown-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('dropdown-menu') };

export const ReuiDropdownMenu1 = { name: 'Basic dropdown menu', ...pattern(1) };
export const ReuiDropdownMenu2 = { name: 'Opening positions', ...pattern(2) };
export const ReuiDropdownMenu3 = { name: 'With icons', ...pattern(3) };
export const ReuiDropdownMenu4 = { name: 'With keyboard shortcuts', ...pattern(4) };
export const ReuiDropdownMenu5 = { name: 'Nested submenus', ...pattern(5) };
export const ReuiDropdownMenu6 = { name: 'Checkbox items', ...pattern(6) };
export const ReuiDropdownMenu7 = { name: 'Radio groups', ...pattern(7) };
export const ReuiDropdownMenu8 = { name: 'Advanced menu', ...pattern(8) };
export const ReuiDropdownMenu9 = { name: 'User profile', ...pattern(9) };
export const ReuiDropdownMenu10 = { name: 'Workspace switcher', ...pattern(10) };
export const ReuiDropdownMenu11 = { name: 'Notifications', ...pattern(11) };
export const ReuiDropdownMenu12 = { name: 'Actions', ...pattern(12) };
export const ReuiDropdownMenu13 = { name: 'Share and export', ...pattern(13) };
export const ReuiDropdownMenu14 = { name: 'Profile with theme and status', ...pattern(14) };
export const ReuiDropdownMenu15 = { name: 'User and create menus', ...pattern(15) };
export const ReuiDropdownMenu16 = { name: 'Quick actions', ...pattern(16) };
export const ReuiDropdownMenu17 = { name: 'Notifications with items', ...pattern(17) };
export const ReuiDropdownMenu18 = { name: 'AI model selector', ...pattern(18) };

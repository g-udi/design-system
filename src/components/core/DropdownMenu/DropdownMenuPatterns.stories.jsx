import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'dropdown-menu',
  import.meta.glob('../../../../.storybook/fixtures/patterns/dropdown-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/dropdown-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('dropdown-menu') };

export const DropdownMenuPattern1 = { name: 'Basic dropdown menu', ...pattern(1) };
export const DropdownMenuPattern2 = { name: 'Opening positions', ...pattern(2) };
export const DropdownMenuPattern3 = { name: 'With icons', ...pattern(3) };
export const DropdownMenuPattern4 = { name: 'With keyboard shortcuts', ...pattern(4) };
export const DropdownMenuPattern5 = { name: 'Nested submenus', ...pattern(5) };
export const DropdownMenuPattern6 = { name: 'Checkbox items', ...pattern(6) };
export const DropdownMenuPattern7 = { name: 'Radio groups', ...pattern(7) };
export const DropdownMenuPattern8 = { name: 'Advanced menu', ...pattern(8) };
export const DropdownMenuPattern9 = { name: 'User profile', ...pattern(9) };
export const DropdownMenuPattern10 = { name: 'Workspace switcher', ...pattern(10) };
export const DropdownMenuPattern11 = { name: 'Notifications', ...pattern(11) };
export const DropdownMenuPattern12 = { name: 'Actions', ...pattern(12) };
export const DropdownMenuPattern13 = { name: 'Share and export', ...pattern(13) };
export const DropdownMenuPattern14 = { name: 'Profile with theme and status', ...pattern(14) };
export const DropdownMenuPattern15 = { name: 'User and create menus', ...pattern(15) };
export const DropdownMenuPattern16 = { name: 'Quick actions', ...pattern(16) };
export const DropdownMenuPattern17 = { name: 'Notifications with items', ...pattern(17) };
export const DropdownMenuPattern18 = { name: 'AI model selector', ...pattern(18) };

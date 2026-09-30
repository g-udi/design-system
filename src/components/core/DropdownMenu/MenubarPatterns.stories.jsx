import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'menubar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/menubar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/menubar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('menubar') };

export const MenubarPattern1 = { name: 'Basic menubar', ...pattern(1) };
export const MenubarPattern2 = { name: 'Menubar with submenus', ...pattern(2) };
export const MenubarPattern3 = { name: 'Menubar with checkbox and radio items', ...pattern(3) };
export const MenubarPattern4 = { name: 'Menubar with icons', ...pattern(4) };
export const MenubarPattern5 = { name: 'Menubar for formatting and media', ...pattern(5) };

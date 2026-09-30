import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'menubar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/menubar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/menubar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('menubar') };

export const MenubarPattern1 = {
  name: 'Application menubar',
  ...pattern(1, 'File, Edit, Format, View and Account menus with icons, shortcuts, disabled items, submenus, checkbox and radio items.')
};

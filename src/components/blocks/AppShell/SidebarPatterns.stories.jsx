import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'sidebar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sidebar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sidebar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Application/AppShell', tags: ['autodocs'], ...catalogueMeta('sidebar') };

export const SidebarPattern1 = { name: 'Workspace switcher', ...pattern(1, 'Grouped navigation with count badges, row menus and a footer account menu.') };
export const SidebarPattern2 = { name: 'Collapsible icon rail', ...pattern(2, 'Labels give way to tooltips at 3rem, with a rail and a trigger to drive it.') };
export const SidebarPattern3 = { name: 'Documentation sub-menus', ...pattern(3, 'A search field, sections that collapse and a sub-tree under the current page.') };
export const SidebarPattern4 = { name: 'Right-hand inspector', ...pattern(4, 'A floating off-canvas panel with row actions, linked counts and a status badge.') };
export const SidebarPattern5 = { name: 'Filter, loading and empty states', ...pattern(5, 'A filter field, skeleton rows while a refresh runs, and a real empty state.') };

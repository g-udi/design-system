import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'context-menu',
  import.meta.glob('../../../../.storybook/fixtures/patterns/context-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/context-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('context-menu') };

export const ContextMenuPattern1 = { name: 'Basic context menu', ...pattern(1) };
export const ContextMenuPattern2 = { name: 'Context menu with icons', ...pattern(2) };
export const ContextMenuPattern3 = { name: 'Context menu with shortcuts', ...pattern(3) };
export const ContextMenuPattern4 = { name: 'Context menu with submenus', ...pattern(4) };
export const ContextMenuPattern5 = { name: 'Context menu labels and separators', ...pattern(5) };
export const ContextMenuPattern6 = { name: 'Context menu with checkboxes', ...pattern(6) };
export const ContextMenuPattern7 = { name: 'Context menu with radio items', ...pattern(7) };
export const ContextMenuPattern8 = { name: 'Context menu with destructive actions', ...pattern(8) };
export const ContextMenuPattern9 = { name: 'Context menu alignment', ...pattern(9) };
export const ContextMenuPattern10 = { name: 'Context menu inside a dialog', ...pattern(10) };

import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'item',
  import.meta.glob('../../../../.storybook/fixtures/patterns/item/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/item/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Application/ResourceList', tags: ['autodocs'], ...catalogueMeta('item') };

export const ItemPattern1 = { name: 'Variants and sizes', ...pattern(1, 'Default, outline and muted rows at the default, sm and xs sizes, side by side.') };
export const ItemPattern11 = { name: 'Settings and integrations', ...pattern(11, 'Icon rows whose trailing slot carries a status badge, an action button, or both.') };
export const ItemPattern9 = { name: 'Team members and roles', ...pattern(9, 'Avatars with presence, role badges and a row menu, plus a pending invite with its own action.') };
export const ItemPattern4 = { name: 'Navigation rows', ...pattern(4, 'Link rows with descriptions, chevrons and separators.') };
export const ItemPattern7 = { name: 'Menu with counts and shortcuts', ...pattern(7, 'Compact link rows ending in a count badge or a keyboard shortcut.') };
export const ItemPattern12 = { name: 'Activity feed', ...pattern(12) };
export const ItemPattern10 = { name: 'Header and footer', ...pattern(10, 'ItemHeader and ItemFooter frame a project card with a status, members and progress.') };

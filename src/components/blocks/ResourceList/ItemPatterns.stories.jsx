import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'item',
  import.meta.glob('../../../../.storybook/fixtures/patterns/item/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/item/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Application/ResourceList', tags: ['autodocs'], ...catalogueMeta('item') };

export const ItemPattern1 = { name: 'Title and description', ...pattern(1) };
export const ItemPattern2 = { name: 'Icon media and actions', ...pattern(2) };
export const ItemPattern3 = { name: 'User with follow button', ...pattern(3) };
export const ItemPattern4 = { name: 'Navigation rows', ...pattern(4) };
export const ItemPattern5 = { name: 'Status badges', ...pattern(5) };
export const ItemPattern6 = { name: 'Files with size and actions', ...pattern(6) };
export const ItemPattern7 = { name: 'Keyboard shortcuts', ...pattern(7) };
export const ItemPattern8 = { name: 'Small size with badges', ...pattern(8) };
export const ItemPattern9 = { name: 'Team members and roles', ...pattern(9) };
export const ItemPattern10 = { name: 'Header and footer', ...pattern(10) };
export const ItemPattern11 = { name: 'Integrations with connect actions', ...pattern(11) };
export const ItemPattern12 = { name: 'Activity feed', ...pattern(12) };

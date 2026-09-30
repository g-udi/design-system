import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'drawer',
  import.meta.glob('../../../../.storybook/fixtures/patterns/drawer/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/drawer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('drawer') };

export const DrawerPattern1 = { name: 'Drawer with scrollable content', ...pattern(1) };
export const DrawerPattern2 = { name: 'Drawer from the right', ...pattern(2) };
export const DrawerPattern3 = { name: 'Drawer from the left', ...pattern(3) };
export const DrawerPattern4 = { name: 'Drawer from the top', ...pattern(4) };
export const DrawerPattern5 = { name: 'Drawer sides', ...pattern(5) };

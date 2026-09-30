import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'navigation-menu',
  import.meta.glob('../../../../.storybook/fixtures/patterns/navigation-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/navigation-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/NavigationMenu', tags: ['autodocs'], ...catalogueMeta('navigation-menu') };

export const NavigationMenuPattern1 = { name: 'Basic navigation menu', ...pattern(1) };
export const NavigationMenuPattern2 = { name: 'Grid layout', ...pattern(2) };
export const NavigationMenuPattern3 = { name: 'With icons', ...pattern(3) };
export const NavigationMenuPattern4 = { name: 'Grid layout with a call to action', ...pattern(4) };

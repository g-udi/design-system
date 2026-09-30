import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'hover-card',
  import.meta.glob('../../../../.storybook/fixtures/patterns/hover-card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/hover-card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Popover', tags: ['autodocs'], ...catalogueMeta('hover-card') };

export const HoverCardPattern1 = { name: 'Basic hover card', ...pattern(1) };
export const HoverCardPattern2 = { name: 'Hover card positions', ...pattern(2) };
export const HoverCardPattern3 = { name: 'Profile hover card', ...pattern(3) };
export const HoverCardPattern4 = { name: 'Hover card with icon', ...pattern(4) };
export const HoverCardPattern5 = { name: 'Hover card with image', ...pattern(5) };
export const HoverCardPattern6 = { name: 'Hover card inside a dialog', ...pattern(6) };
export const HoverCardPattern7 = { name: 'Relative timestamp hover card', ...pattern(7) };
export const HoverCardPattern8 = { name: 'Paginated release notes hover card', ...pattern(8) };

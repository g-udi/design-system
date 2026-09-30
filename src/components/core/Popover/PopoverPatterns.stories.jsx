import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'popover',
  import.meta.glob('../../../../.storybook/fixtures/patterns/popover/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/popover/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Popover', tags: ['autodocs'], ...catalogueMeta('popover') };

export const PopoverPattern1 = { name: 'Basic popover', ...pattern(1) };
export const PopoverPattern2 = { name: 'Sides', ...pattern(2) };
export const PopoverPattern3 = { name: 'With form', ...pattern(3) };
export const PopoverPattern4 = { name: 'Alignment', ...pattern(4) };
export const PopoverPattern5 = { name: 'Inside a dialog', ...pattern(5) };
export const PopoverPattern6 = { name: 'User profile', ...pattern(6) };
export const PopoverPattern7 = { name: 'Custom content', ...pattern(7) };
export const PopoverPattern8 = { name: 'Media preview', ...pattern(8) };
export const PopoverPattern9 = { name: 'Relative time with time zones', ...pattern(9) };
export const PopoverPattern10 = { name: 'With controls', ...pattern(10) };
export const PopoverPattern11 = { name: 'With navigation', ...pattern(11) };

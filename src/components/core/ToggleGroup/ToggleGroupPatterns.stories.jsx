import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'toggle-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', tags: ['autodocs'], ...catalogueMeta('toggle-group') };

export const ToggleGroupPattern1 = { name: 'Basic toggle group', ...pattern(1) };
export const ToggleGroupPattern2 = { name: 'Outline variant', ...pattern(2) };
export const ToggleGroupPattern3 = { name: 'Sizes', ...pattern(3) };
export const ToggleGroupPattern4 = { name: 'Custom spacing', ...pattern(4) };
export const ToggleGroupPattern5 = { name: 'Filter control', ...pattern(5) };
export const ToggleGroupPattern6 = { name: 'Vertical orientation', ...pattern(6) };
export const ToggleGroupPattern7 = { name: 'Text alignment', ...pattern(7) };
export const ToggleGroupPattern8 = { name: 'View mode switching', ...pattern(8) };
export const ToggleGroupPattern9 = { name: 'Vertical settings', ...pattern(9) };
export const ToggleGroupPattern10 = { name: 'Color theme', ...pattern(10) };
export const ToggleGroupPattern11 = { name: 'Font size', ...pattern(11) };
export const ToggleGroupPattern12 = { name: 'Time range filter', ...pattern(12) };
export const ToggleGroupPattern13 = { name: 'Notification channels', ...pattern(13) };
export const ToggleGroupPattern14 = { name: 'Layout columns', ...pattern(14) };
export const ToggleGroupPattern15 = { name: 'Sort direction', ...pattern(15) };
export const ToggleGroupPattern16 = { name: 'Pricing tier', ...pattern(16) };

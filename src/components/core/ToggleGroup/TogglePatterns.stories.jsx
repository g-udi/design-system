import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'toggle',
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', tags: ['autodocs'], ...catalogueMeta('toggle') };

export const TogglePattern1 = { name: 'Basic toggle', ...pattern(1) };
export const TogglePattern2 = { name: 'Outline toggle buttons', ...pattern(2) };
export const TogglePattern3 = { name: 'Toggle sizes', ...pattern(3) };
export const TogglePattern4 = { name: 'Toggle with button and icon', ...pattern(4) };
export const TogglePattern5 = { name: 'Disabled toggle', ...pattern(5) };
export const TogglePattern6 = { name: 'Toggle with icon', ...pattern(6) };
export const TogglePattern7 = { name: 'Toggle with count badge', ...pattern(7) };
export const TogglePattern8 = { name: 'Toggle size variants', ...pattern(8) };
export const TogglePattern9 = { name: 'Toggle with icon swap', ...pattern(9) };
export const TogglePattern10 = { name: 'Toggle with changing label', ...pattern(10) };
export const TogglePattern11 = { name: 'Reaction toggles', ...pattern(11) };
export const TogglePattern12 = { name: 'Toggle with tooltip', ...pattern(12) };
export const TogglePattern13 = { name: 'Disabled toggle states', ...pattern(13) };
export const TogglePattern14 = { name: 'Mute toggle', ...pattern(14) };

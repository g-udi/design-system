import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'radio-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/radio-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/radio-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/RadioGroup', tags: ['autodocs'], ...catalogueMeta('radio-group') };

export const RadioGroupPattern1 = { name: 'Basic', ...pattern(1) };
export const RadioGroupPattern2 = { name: 'Disabled', ...pattern(2) };
export const RadioGroupPattern3 = { name: 'With descriptions', ...pattern(3) };
export const RadioGroupPattern4 = { name: 'Invalid', ...pattern(4) };
export const RadioGroupPattern5 = { name: 'Colored', ...pattern(5) };
export const RadioGroupPattern6 = { name: 'Legend and description', ...pattern(6) };
export const RadioGroupPattern7 = { name: 'Cards with descriptions', ...pattern(7) };
export const RadioGroupPattern8 = { name: 'Card with separators', ...pattern(8) };
export const RadioGroupPattern9 = { name: 'Card with icons', ...pattern(9) };
export const RadioGroupPattern10 = { name: 'In a frame', ...pattern(10) };
export const RadioGroupPattern11 = { name: 'Grid layout', ...pattern(11) };
export const RadioGroupPattern12 = { name: 'Avatar cards', ...pattern(12) };
export const RadioGroupPattern13 = { name: 'Payment method cards', ...pattern(13) };
export const RadioGroupPattern14 = { name: 'Tooltip info', ...pattern(14) };
export const RadioGroupPattern15 = { name: 'With badges', ...pattern(15) };
export const RadioGroupPattern16 = { name: 'Inline horizontal', ...pattern(16) };
export const RadioGroupPattern17 = { name: 'Pricing plan cards', ...pattern(17) };

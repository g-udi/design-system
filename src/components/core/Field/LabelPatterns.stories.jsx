import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'label',
  import.meta.glob('../../../../.storybook/fixtures/patterns/label/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/label/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', tags: ['autodocs'], ...catalogueMeta('label') };

export const LabelPattern1 = { name: 'Basic label', ...pattern(1) };
export const LabelPattern2 = { name: 'Label with a checkbox', ...pattern(2) };
export const LabelPattern3 = { name: 'Label for a textarea', ...pattern(3) };
export const LabelPattern4 = { name: 'Disabled label', ...pattern(4) };
export const LabelPattern5 = { name: 'Label with required indicator', ...pattern(5) };
export const LabelPattern6 = { name: 'Label with optional indicator', ...pattern(6) };
export const LabelPattern7 = { name: 'Label with info tooltip', ...pattern(7) };
export const LabelPattern8 = { name: 'Label with badge', ...pattern(8) };
export const LabelPattern9 = { name: 'Label with character counter', ...pattern(9) };
export const LabelPattern10 = { name: 'Label with helper text', ...pattern(10) };
export const LabelPattern11 = { name: 'Label with error state', ...pattern(11) };
export const LabelPattern12 = { name: 'Label with inline edit', ...pattern(12) };
export const LabelPattern13 = { name: 'Label with status dot', ...pattern(13) };

import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'checkbox',
  import.meta.glob('../../../../.storybook/fixtures/patterns/checkbox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/checkbox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Checkbox', tags: ['autodocs'], ...catalogueMeta('checkbox') };

export const CheckboxPattern1 = { name: 'With label', ...pattern(1) };
export const CheckboxPattern2 = { name: 'Disabled', ...pattern(2) };
export const CheckboxPattern3 = { name: 'Invalid', ...pattern(3) };
export const CheckboxPattern4 = { name: 'Indeterminate', ...pattern(4) };
export const CheckboxPattern5 = { name: 'Label and description', ...pattern(5) };
export const CheckboxPattern6 = { name: 'Custom colour', ...pattern(6) };
export const CheckboxPattern7 = { name: 'Circle', ...pattern(7) };
export const CheckboxPattern8 = { name: 'Group', ...pattern(8) };
export const CheckboxPattern9 = { name: 'Card group', ...pattern(9) };
export const CheckboxPattern10 = { name: 'Group in a frame', ...pattern(10) };
export const CheckboxPattern11 = { name: 'Stacked card group', ...pattern(11) };
export const CheckboxPattern12 = { name: 'Stacked card group with icons', ...pattern(12) };
export const CheckboxPattern13 = { name: 'Corner badge cards', ...pattern(13) };
export const CheckboxPattern14 = { name: 'Corner checkbox cards with icons', ...pattern(14) };
export const CheckboxPattern15 = { name: 'Avatar cards', ...pattern(15) };
export const CheckboxPattern16 = { name: 'Nested group', ...pattern(16) };
export const CheckboxPattern17 = { name: 'Payment method cards', ...pattern(17) };
export const CheckboxPattern18 = { name: 'Label with info tooltip', ...pattern(18) };
export const CheckboxPattern19 = { name: 'Group with badges', ...pattern(19) };
export const CheckboxPattern21 = { name: 'Inline horizontal group', ...pattern(21) };
export const CheckboxPattern22 = { name: 'Feature badge', ...pattern(22) };

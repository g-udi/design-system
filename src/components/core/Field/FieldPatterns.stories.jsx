import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'field',
  import.meta.glob('../../../../.storybook/fixtures/patterns/field/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', id: 'core-field', tags: ['autodocs'], ...catalogueMeta('field') };

export const FieldPattern7 = { name: 'Settings form with validation', ...pattern(7) };
export const FieldPattern1 = { name: 'Controls in fields', ...pattern(1, 'Label, control and description around input groups, selects, a slider, an OTP input and a textarea.') };
export const FieldPattern10 = { name: 'Fieldsets of choices', ...pattern(10, 'Legends group switches, checkboxes with a disabled option, and a radio group, split by separators.') };
export const FieldPattern11 = { name: 'Validation errors', ...pattern(11, 'Single and multiple error messages under invalid fields.') };
export const FieldPattern9 = { name: 'Responsive layout', ...pattern(9, 'Labels sit beside their controls on wide screens and stack on narrow ones.') };

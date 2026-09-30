import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'field',
  import.meta.glob('../../../../.storybook/fixtures/patterns/field/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', tags: ['autodocs'], ...catalogueMeta('field') };

export const FieldPattern1 = { name: 'Input groups', ...pattern(1) };
export const FieldPattern2 = { name: 'Input and textarea', ...pattern(2) };
export const FieldPattern3 = { name: 'Select control', ...pattern(3) };
export const FieldPattern4 = { name: 'Radio groups and checkboxes', ...pattern(4) };
export const FieldPattern5 = { name: 'Slider and switch', ...pattern(5) };
export const FieldPattern6 = { name: 'OTP input', ...pattern(6) };
export const FieldPattern7 = { name: 'Settings form with validation', ...pattern(7) };
export const FieldPattern8 = { name: 'Permission checkboxes', ...pattern(8) };
export const FieldPattern9 = { name: 'Responsive layout', ...pattern(9) };
export const FieldPattern10 = { name: 'Notification preferences', ...pattern(10) };
export const FieldPattern11 = { name: 'Validation errors', ...pattern(11) };

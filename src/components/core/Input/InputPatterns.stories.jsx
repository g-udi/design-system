import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'input',
  import.meta.glob('../../../../.storybook/fixtures/patterns/input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', tags: ['autodocs'], ...catalogueMeta('input') };

export const InputPattern1 = { name: 'Basic input', ...pattern(1) };
export const InputPattern2 = { name: 'Input with label', ...pattern(2) };
export const InputPattern3 = { name: 'Input with description', ...pattern(3) };
export const InputPattern4 = { name: 'Disabled input', ...pattern(4) };
export const InputPattern5 = { name: 'Input with error message', ...pattern(5) };
export const InputPattern6 = { name: 'Input with character counter', ...pattern(6) };
export const InputPattern7 = { name: 'Input with password type', ...pattern(7) };
export const InputPattern8 = { name: 'Input with phone type', ...pattern(8) };
export const InputPattern9 = { name: 'Input with URL type', ...pattern(9) };
export const InputPattern10 = { name: 'Input with number type', ...pattern(10) };
export const InputPattern11 = { name: 'Input with date type', ...pattern(11) };
export const InputPattern12 = { name: 'Input with file type', ...pattern(12) };
export const InputPattern13 = { name: 'Input with required indicator', ...pattern(13) };
export const InputPattern14 = { name: 'Input with time type', ...pattern(14) };
export const InputPattern15 = { name: 'Complex input form with multiple fields', ...pattern(15) };
export const InputPattern16 = { name: 'Input label with tooltip', ...pattern(16) };
export const InputPattern17 = { name: 'Input label with badge', ...pattern(17) };
export const InputPattern18 = { name: 'Input label with optional badge', ...pattern(18) };
export const InputPattern19 = { name: 'Input label with link and visibility toggle', ...pattern(19) };
export const InputPattern20 = { name: 'Input with horizontal orientation', ...pattern(20) };
export const InputPattern21 = { name: 'Input with multiple error messages', ...pattern(21) };
export const InputPattern22 = { name: 'Basic password strength with dynamic hint and icons', ...pattern(22) };
export const InputPattern23 = { name: 'Advanced password strength indicator with progress', ...pattern(23) };
export const InputPattern24 = { name: 'Input with pulsed background animation', ...pattern(24) };
export const InputPattern25 = { name: 'Input with custom focus ring', ...pattern(25) };
export const InputPattern26 = { name: 'Input with subtle background', ...pattern(26) };
export const InputPattern27 = { name: 'Input with bottom border only', ...pattern(27) };
export const InputPattern28 = { name: 'Color input', ...pattern(28) };
export const InputPattern29 = { name: 'Range input with value indicator', ...pattern(29) };
export const InputPattern30 = { name: 'Pill-shaped input', ...pattern(30) };
export const InputPattern31 = { name: 'Minimal input without borders or background', ...pattern(31) };

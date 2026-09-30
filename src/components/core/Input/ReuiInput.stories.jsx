// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'input',
  import.meta.glob('../../../../.storybook/fixtures/reui/input/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/input/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', tags: ['autodocs'], ...catalogueMeta('input') };

export const ReuiInput1 = { name: 'Basic input', ...pattern(1) };
export const ReuiInput2 = { name: 'Input with label', ...pattern(2) };
export const ReuiInput3 = { name: 'Input with description', ...pattern(3) };
export const ReuiInput4 = { name: 'Disabled input', ...pattern(4) };
export const ReuiInput5 = { name: 'Input with error message', ...pattern(5) };
export const ReuiInput6 = { name: 'Input with character counter', ...pattern(6) };
export const ReuiInput7 = { name: 'Input with password type', ...pattern(7) };
export const ReuiInput8 = { name: 'Input with phone type', ...pattern(8) };
export const ReuiInput9 = { name: 'Input with URL type', ...pattern(9) };
export const ReuiInput10 = { name: 'Input with number type', ...pattern(10) };
export const ReuiInput11 = { name: 'Input with date type', ...pattern(11) };
export const ReuiInput12 = { name: 'Input with file type', ...pattern(12) };
export const ReuiInput13 = { name: 'Input with required indicator', ...pattern(13) };
export const ReuiInput14 = { name: 'Input with time type', ...pattern(14) };
export const ReuiInput15 = { name: 'Complex input form with multiple fields', ...pattern(15) };
export const ReuiInput16 = { name: 'Input label with tooltip', ...pattern(16) };
export const ReuiInput17 = { name: 'Input label with badge', ...pattern(17) };
export const ReuiInput18 = { name: 'Input label with optional badge', ...pattern(18) };
export const ReuiInput19 = { name: 'Input label with link and visibility toggle', ...pattern(19) };
export const ReuiInput20 = { name: 'Input with horizontal orientation', ...pattern(20) };
export const ReuiInput21 = { name: 'Input with multiple error messages', ...pattern(21) };
export const ReuiInput22 = { name: 'Basic password strength with dynamic hint and icons', ...pattern(22) };
export const ReuiInput23 = { name: 'Advanced password strength indicator with progress', ...pattern(23) };
export const ReuiInput24 = { name: 'Input with pulsed background animation', ...pattern(24) };
export const ReuiInput25 = { name: 'Input with custom focus ring', ...pattern(25) };
export const ReuiInput26 = { name: 'Input with subtle background', ...pattern(26) };
export const ReuiInput27 = { name: 'Input with bottom border only', ...pattern(27) };
export const ReuiInput28 = { name: 'Color input', ...pattern(28) };
export const ReuiInput29 = { name: 'Range input with value indicator', ...pattern(29) };
export const ReuiInput30 = { name: 'Pill-shaped input', ...pattern(30) };
export const ReuiInput31 = { name: 'Minimal input without borders or background', ...pattern(31) };

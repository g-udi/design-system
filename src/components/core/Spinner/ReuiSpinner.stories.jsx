// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'spinner',
  import.meta.glob('../../../../.storybook/fixtures/reui/spinner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/spinner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Spinner', tags: ['autodocs'], ...catalogueMeta('spinner') };

export const ReuiSpinner1 = { name: 'Basic spinner', ...pattern(1) };
export const ReuiSpinner2 = { name: 'Spinners in buttons', ...pattern(2) };
export const ReuiSpinner3 = { name: 'Spinners in badges', ...pattern(3) };
export const ReuiSpinner4 = { name: 'Spinner in input group', ...pattern(4) };
export const ReuiSpinner5 = { name: 'Spinner in empty state', ...pattern(5) };
export const ReuiSpinner6 = { name: 'Button loading states', ...pattern(6) };
export const ReuiSpinner7 = { name: 'Overlay loading spinner', ...pattern(7) };
export const ReuiSpinner8 = { name: 'Full page loading state', ...pattern(8) };
export const ReuiSpinner9 = { name: 'Inline loading text with spinner', ...pattern(9) };
export const ReuiSpinner10 = { name: 'Animated loading dots', ...pattern(10) };
export const ReuiSpinner11 = { name: 'Spinner overlay on card', ...pattern(11) };
export const ReuiSpinner12 = { name: 'Spinner color variants', ...pattern(12) };

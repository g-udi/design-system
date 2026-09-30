// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'spinner',
  import.meta.glob('../../../../.storybook/fixtures/reui/spinner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/spinner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Spinner', tags: ['autodocs'], ...catalogueMeta('spinner') };

export const ReuiSpinner1 = { name: 'Basic', ...pattern(1) };
export const ReuiSpinner2 = { name: 'In buttons', ...pattern(2) };
export const ReuiSpinner3 = { name: 'In badges', ...pattern(3) };
export const ReuiSpinner4 = { name: 'In an input group', ...pattern(4) };
export const ReuiSpinner5 = { name: 'In an empty state', ...pattern(5) };
export const ReuiSpinner6 = { name: 'Button loading states', ...pattern(6) };
export const ReuiSpinner7 = { name: 'Overlay', ...pattern(7) };
export const ReuiSpinner8 = { name: 'Full page', ...pattern(8) };
export const ReuiSpinner9 = { name: 'Inline with text', ...pattern(9) };
export const ReuiSpinner10 = { name: 'Loading dots', ...pattern(10) };
export const ReuiSpinner11 = { name: 'Card overlay', ...pattern(11) };
export const ReuiSpinner12 = { name: 'Colors', ...pattern(12) };

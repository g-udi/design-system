// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'progress',
  import.meta.glob('../../../../.storybook/fixtures/reui/progress/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/progress/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Progress', tags: ['autodocs'], ...catalogueMeta('progress') };

export const ReuiProgress1 = { name: 'Basic', ...pattern(1) };
export const ReuiProgress2 = { name: 'Small', ...pattern(2) };
export const ReuiProgress3 = { name: 'Large', ...pattern(3) };
export const ReuiProgress4 = { name: 'Status messages', ...pattern(4) };
export const ReuiProgress5 = { name: 'File upload list', ...pattern(5) };
export const ReuiProgress6 = { name: 'Driven by a slider', ...pattern(6) };
export const ReuiProgress7 = { name: 'Multi-step', ...pattern(7) };
export const ReuiProgress8 = { name: 'Custom colors', ...pattern(8) };

// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'progress',
  import.meta.glob('../../../../.storybook/fixtures/reui/progress/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/progress/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Progress', tags: ['autodocs'], ...catalogueMeta('progress') };

export const ReuiProgress1 = { name: 'Basic progress', ...pattern(1) };
export const ReuiProgress2 = { name: 'Small progress', ...pattern(2) };
export const ReuiProgress3 = { name: 'Large progress', ...pattern(3) };
export const ReuiProgress4 = { name: 'Progress bar with status messages', ...pattern(4) };
export const ReuiProgress5 = { name: 'File upload list with progress & status', ...pattern(5) };
export const ReuiProgress6 = { name: 'Progress bar with slider', ...pattern(6) };
export const ReuiProgress7 = { name: 'Multi-step progress indicator', ...pattern(7) };
export const ReuiProgress8 = { name: 'Progress bar with custom colors', ...pattern(8) };

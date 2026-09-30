import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'progress',
  import.meta.glob('../../../../.storybook/fixtures/patterns/progress/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/progress/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Progress', tags: ['autodocs'], ...catalogueMeta('progress') };

export const ProgressPattern1 = { name: 'Basic', ...pattern(1) };
export const ProgressPattern2 = { name: 'Small', ...pattern(2) };
export const ProgressPattern3 = { name: 'Large', ...pattern(3) };
export const ProgressPattern4 = { name: 'Status messages', ...pattern(4) };
export const ProgressPattern5 = { name: 'File upload list', ...pattern(5) };
export const ProgressPattern6 = { name: 'Driven by a slider', ...pattern(6) };
export const ProgressPattern7 = { name: 'Multi-step', ...pattern(7) };
export const ProgressPattern8 = { name: 'Custom colors', ...pattern(8) };

import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'spinner',
  import.meta.glob('../../../../.storybook/fixtures/patterns/spinner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/spinner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Spinner', tags: ['autodocs'], ...catalogueMeta('spinner') };

export const SpinnerPattern1 = { name: 'Basic', ...pattern(1) };
export const SpinnerPattern2 = { name: 'In buttons', ...pattern(2) };
export const SpinnerPattern3 = { name: 'In badges', ...pattern(3) };
export const SpinnerPattern4 = { name: 'In an input group', ...pattern(4) };
export const SpinnerPattern5 = { name: 'In an empty state', ...pattern(5) };
export const SpinnerPattern6 = { name: 'Button loading states', ...pattern(6) };
export const SpinnerPattern7 = { name: 'Overlay', ...pattern(7) };
export const SpinnerPattern8 = { name: 'Full page', ...pattern(8) };
export const SpinnerPattern9 = { name: 'Inline with text', ...pattern(9) };
export const SpinnerPattern10 = { name: 'Loading dots', ...pattern(10) };
export const SpinnerPattern11 = { name: 'Card overlay', ...pattern(11) };
export const SpinnerPattern12 = { name: 'Colors', ...pattern(12) };
